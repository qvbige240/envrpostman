/**
 * Created by qianmengxi on 15-6-1.
 */
var Monster = cc.Node.extend({
    _jsonName:"",
    _animation:null,
    _moveSpeed:0.0,
    _halfWidth:0.0,
    _isStopWalk:false,
    ctor: function (name) {
        this._super();

        var monsterJson = InitData.getMonsterJson(name);
        if (monsterJson != undefined)
        {
            this._jsonName = monsterJson["file_name"];
            this._moveSpeed = monsterJson["speed"];
            this._halfWidth = monsterJson["radius"];
        }
        else
        {
            cc.log("monster %s not found!!!", name);
        }
    },
    onEnter: function () {
        this._super();

        var jsonPath = "res/spine/" + this._jsonName + "/" + this._jsonName + ".json";
        var atlasPath = "res/spine/" + this._jsonName + "/" + this._jsonName + ".atlas";

        this._animation = createSkeletonAnimation(this._jsonName, jsonPath, atlasPath);
        //this._animation = new sp.SkeletonAnimation(jsonPath, atlasPath);
        this._animation.setAnchorPoint(cc.p(0.5, 0));
        //cc.log("monster jsonname:%f", this._jsonName);
        this.addChild(this._animation);
    },
    pauseAction: function () {
        this._animation.pause();
    },
    resumeAction: function () {
        this._animation.resume();
    },
    getType: function () {
        return ItemType.monster;
    },
    getMoveSpeed: function () {
        return this._moveSpeed;
    },
    getHalfWidth: function () {
        return this._halfWidth;
    },
    stopWalk: function () {
        this._isStopWalk = true;
    },
    isStopWalk: function () {
        return this._isStopWalk;
    },
    playWalk: function () {
        this._animation.setAnimation(0, "walk", true);
        //this._animation.setAnimation(0, "zhujue_walk1", true);
    },
    playAgainst: function () {
        this._animation.setAnimation(0, "cx", true);
    },

});