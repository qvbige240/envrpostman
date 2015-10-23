
var Postman = cc.Node.extend({
    _animation:null,
    _halfWidth:0.0,
    _isDead:false,
    _isInvicible:false,
    _speed:0,
    _postmanName:"",
    _isMoving:false,
    ctor: function (postmanName) {
        cc.log("postmanName:%s", postmanName);
        this._super();
        this._postmanName = postmanName;
    },
    init: function () {
        if (!this._super())
        {
            return false;
        }

        var heroJson = InitData.getPostmanJson(this._postmanName);
        if (heroJson != undefined)
        {
            var fileName = heroJson["file_name"];
            var jsonPath = "res/spine/" + fileName + "/" + "zhujue.json";
            var atlasPath = "res/spine/" + fileName + "/" + "zhujue.atlas";

            this._halfWidth = heroJson["radius"];
            this._speed = heroJson["speed"];

            cc.log("jsonPath:%s", jsonPath);
            this._animation = createSkeletonAnimation(this._postmanName, jsonPath, atlasPath);
            //this._animation = new sp.SkeletonAnimation(jsonPath, atlasPath);
            this._animation.setAnchorPoint(cc.p(0.5, 0));
            this.addChild(this._animation);

            return true;
        }

        cc.log("postman %s not found!!!!", this._postmanName);
        return false;
    },
    isDead: function () {
        return this._isDead;
    },
    setDead: function (bDead) {
        this._isDead = bDead;
    },
    isInvicible: function () {
        return this._isInvicible;
    },
    setInvicible: function (bInvicible) {
        this._isInvicible = bInvicible;
    },
    runBlinkAction: function () {
        //var color = this._animation.getColor();
        cc.log("bInvicible true");
        var blink = cc.blink(1, 5);
        var repeat = cc.repeatForever(blink);
        repeat.setTag(99);
        this._animation.runAction(repeat);

        var delay = cc.delayTime(3.0);
        var callFunc = cc.callFunc(function (sender, value) {
            sender.setVisible(true);
            sender.stopActionByTag(99);
        });
        this._animation.runAction(cc.sequence(delay, callFunc));
    },
    isMoving: function () {
        return this._isMoving;
    },
    startMove: function () {
        this._isMoving = true;
    },
    stopMove: function () {
        this._isMoving = false;
    },
    getType: function () {
        return ItemType.none;
    },
    getHalfWidth: function () {
        return this._halfWidth;
    },
    getSpeed: function () {
        return this._speed;
    },
    pauseAction: function () {
        this._animation.pause();
    },
    resumeAction: function () {
        this._animation.resume();
    },
    playWalk: function () {
        this.clearListener();
        this._animation.setToSetupPose();
        this._animation.setAnimation(0, "zhujue_walk1", true);
        //this._animation.setAnimation(0, "walk", true);
    },
    addWalk: function () {
        this._animation.addAnimation(0, "zhujue_walk1", true);
    },
    playRun: function () {
        this.clearListener();
        this._animation.setToSetupPose();
        this._animation.setAnimation(0, "zhujue_walk2", true);
    },
    addRun: function () {
        this._animation.addAnimation(0, "zhujue_walk2", true);
    },
    playJump:function(callBack){
        this.clearListener();
        var ani = this._animation;
        this._animation.setToSetupPose();
        this._animation.setAnimation(0, "zhujue_jump", false);
        this._animation.setEndListener(function (trackIndex) {
            var entry = ani.getCurrent(trackIndex);
            if(entry){
                var animationName = entry.animation ? entry.animation.name : "";
                if (animationName == "zhujue_jump")
                {
                    callBack();
                }
            }
        });
    },
    playDie1:function(){
        this.clearListener();
        this._animation.setToSetupPose();
        this._animation.setAnimation(0, "zhujue_lose2a", false);
        this._animation.addAnimation(0, "zhujue_lose2b", true);
    },
    playDie2: function () {
        this.clearListener();
        this._animation.setToSetupPose();
        this._animation.setAnimation(0, "zhujue_lose1a", false);
        this._animation.addAnimation(0, "zhujue_lose1b", true);
    },
    setTimeScale: function (timeScale) {
        this._animation.setTimeScale(timeScale);
    },
    clearListener: function () {
        this._animation.setStartListener(null);
        this._animation.setCompleteListener(null);
        this._animation.setEventListener(null);
        this._animation.setEndListener(null);
    }

});