/**
 * Created by qianmengxi on 15-6-2.
 */
var UIMain = cc.Node.extend({
    _road1:null,
    _road2:null,
    _topTreeNode:null,
    _bottomTreeNode:null,
    _monsterNode:null,
    _moveBtnSrcPosX:0.0,
    _moveBtnSrcPosY:0.0,
    _jumpCaller:null,
    _moveCaller:null,
    _pauseEventCaller:null,
    _onTouchJumpEvent:null,
    _onTouchMoveEvent:null,
    _onTouchPauseEvent:null,
    _moveEventPerformed:false,//移动事件的回调是否以执行
    _lastTagImg:null,
    _nowTagImg:null,
    _nextTagImg:null,
    _moveBtn:null,
    _recordImg:null,
    _endImg:null,
    _bgImg:null,//背景图
    _cloudImg:null,//云
    _levelID:0,
    _goldText:null,//金币text
    _lifeImg:null,
    _distanceText:null,
    _listener:null,
    ctor: function (levelID) {
        this._super();
        this._levelID = levelID;
    },
    init: function () {
        if (!this._super()) {
            return false;
        }

        var baseNode = ParseUIFile("res/Main.json");
        this.addChild(baseNode);

        this._bgImg = ccui.helper.seekWidgetByName(baseNode, "Image_bg");
        this._cloudImg = ccui.helper.seekWidgetByName(baseNode, "Image_cloud");
        var touchPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_touch");
        this._jumpBtn = ccui.helper.seekWidgetByName(baseNode, "Button_jump");
        this._pauseBtn = ccui.helper.seekWidgetByName(baseNode, "Button_pause");
        this._upBtn = ccui.helper.seekWidgetByName(baseNode, "Button_up");
        this._downBtn = ccui.helper.seekWidgetByName(baseNode, "Button_down");
        this._lastTagImg = ccui.helper.seekWidgetByName(baseNode, "Image_last");
        this._nowTagImg = ccui.helper.seekWidgetByName(baseNode, "Image_now");
        this._nextTagImg = ccui.helper.seekWidgetByName(baseNode, "Image_next");
        this._road1 = ccui.helper.seekWidgetByName(baseNode, "Image_road1");
        this._road2 = ccui.helper.seekWidgetByName(baseNode, "Image_road2");
        this._topTreeNode = ccui.helper.seekWidgetByName(baseNode, "Panel_top_tree");
        this._bottomTreeNode = ccui.helper.seekWidgetByName(baseNode, "Panel_bottom_tree");
        this._monsterNode = ccui.helper.seekWidgetByName(baseNode, "Panel_monster");
        this._recordImg = ccui.helper.seekWidgetByName(baseNode, "Image_record");
        this._endImg = ccui.helper.seekWidgetByName(baseNode, "Image_end");
        this._goldText = ccui.helper.seekWidgetByName(baseNode, "Text_gold");
        this._lifeImg = ccui.helper.seekWidgetByName(baseNode, "Image_life");
        this._distanceText = ccui.helper.seekWidgetByName(baseNode, "Text_distance");
        this._distanceText.setString(0);
        this._recordImg.setVisible(false);
        this._endImg.setVisible(false);
        this._cloudImg.ignoreContentAdaptWithSize(true);

        touchPanel.addTouchEventListener(this.onTouchMoveBtn, this);
        this._pauseBtn.addTouchEventListener(this.onTouchPauseBtn, this);
        this._jumpBtn.addTouchEventListener(this.onTouchJumpBtn, this);
        this._upBtn.addTouchEventListener(this.onTouchUpBtn, this);
        this._downBtn.addTouchEventListener(this.onTouchDownBtn, this);

        this.initButtonName();
        this.refreshLevel(this._levelID);
        this.refreshGoldText();
        this.refreshPostmanImg();

        //键盘操作
        var keyboardPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_keyboard");
        keyboardPanel.setVisible(EnableKeyboard);

        //do it on mainScene.js
        //this.enableKeyboard();

        return true;
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    initButtonName: function () {
        var btnName = InitData.getStringByKey("jump");
        AddNameToButton(btnName, this._jumpBtn);

        if (!IsChinese)
        {
            this._lastTagImg.loadTexture("Common/_0004a.png", ccui.Widget.PLIST_TEXTURE);
            this._nextTagImg.loadTexture("Common/_0003a.png", ccui.Widget.PLIST_TEXTURE);
            this._recordImg.loadTexture("Common/_0075a.png", ccui.Widget.PLIST_TEXTURE);
            //this._recordImg.ignoreContentAdaptWithSize(true);
            //this._recordImg.setContentSize(cc.size(179, 197));
            this._endImg.loadTexture("Common/_0074a.png", ccui.Widget.PLIST_TEXTURE);
            //this._endImg.ignoreContentAdaptWithSize(true);
            //this._endImg.setContentSize(cc.size(349, 379));
        }
    },
    refreshLevel: function (levelID) {
        var levelInfo = InitData.getLevelJson(levelID);
        var bgPath = "Common/" + levelInfo["bg_2"];
        var roadPath = "Common/" + levelInfo["road"];
        var cloudPath = "Common/" + levelInfo["cloud"];

        this._bgImg.loadTexture(bgPath, ccui.Widget.PLIST_TEXTURE);
        this._road1.loadTexture(roadPath, ccui.Widget.PLIST_TEXTURE);
        this._road2.loadTexture(roadPath, ccui.Widget.PLIST_TEXTURE);
        this._cloudImg.loadTexture(cloudPath, ccui.Widget.PLIST_TEXTURE);
    },
    refreshGoldText: function (dt) {
        this._goldText.setString(GlobalGold);
    },
    refreshPostmanImg: function () {
        //更改人物头像
        var defaultName = GameStorage.getDefaultPostmanName();
        var postmanJson = InitData.getPostmanJson(defaultName);
        var iconPath = "Common/" + postmanJson["icon_tag"];
        this._nowTagImg.loadTexture(iconPath, ccui.Widget.PLIST_TEXTURE);
    },
    setLifeImg: function (curLife) {
        if (curLife >= 0)
        {
            for (var i = 1; i<=5; i++)
            {
                var lifeImg = ccui.helper.seekWidgetByName(this._lifeImg, "Image_life"+i);
                if (i <= curLife)
                {
                    lifeImg.setVisible(true);
                }
                else
                {
                    lifeImg.setVisible(false);
                }
            }
        }
    },
    getRoad1Img: function () {
        return this._road1;
    },
    getRoad2Img: function () {
        return this._road2;
    },
    getTopTreeNode: function () {
        return this._topTreeNode;
    },
    getBottomTreeNode: function () {
        return this._bottomTreeNode;
    },
    getMonsterNode: function () {
        return this._monsterNode;
    },
    setCurDistance: function (length) {
        var name = InitData.getStringByKey("meter");
        this._distanceText.setString(name+":"+length);
    },
    setRecordImgVisible: function (bVisible) {
        this._recordImg.setVisible(bVisible);
    },
    setRecordImgPositionX: function (posX) {
        this._recordImg.setVisible(true);
        this._recordImg.setPositionX(posX);
    },
    setEndImgPositionX: function (posX) {
        this._endImg.setVisible(true);
        this._endImg.setPositionX(posX);
    },
    setCloudPercentPositionX: function (percent) {
        var realPercent = percent>1?1:percent;
        realPercent = realPercent < 0?0:realPercent;
        realPercent = 1 - realPercent;
        this._cloudImg.setPositionX(realPercent * ScreenWidth);
    },
    setNowTagPercentPositionX: function (percent) {
        var realPercent = percent>1?1:percent;
        var totalLen = this._nextTagImg.getPositionX();
        this._nowTagImg.setPositionX(realPercent * totalLen);
    },
    setLastTagVisible: function (bVisible) {
        this._lastTagImg.setVisible(bVisible);
    },
    setNextTagVisible: function (bVisible) {
        this._nextTagImg.setVisible(bVisible);
    },
    setCurTagVisible: function (bVisible) {
        this._nowTagImg.setVisible(bVisible);
    },
    setLastTagPercentPositionX: function (percent) {
        var realPercent = percent>1?1:percent;
        var totalLen = this._nextTagImg.getPositionX();
        this._lastTagImg.setPositionX(realPercent * totalLen);
    },
    addMoveEventCallFunc: function (caller, callBack) {
        this._moveCaller = caller;
        this._onTouchMoveEvent = callBack;
    },
    addJumpEventCallFunc: function (caller, callBack) {
        this._jumpCaller = caller;
        this._onTouchJumpEvent = callBack;
    },
    addPauseEventCallFunc: function (caller, callBack) {
        this._pauseEventCaller = caller;
        this._onTouchPauseEvent = callBack;
    },
    onTouchMoveBtn: function (caller, type) {
        if (type == ccui.Widget.TOUCH_BEGAN)
        {
            //cc.log("onTouchBegan");
        }
        else if (type == ccui.Widget.TOUCH_MOVED)
        {
            var beganPos = caller.getTouchBeganPosition();
            var curPos = caller.getTouchMovePosition();
            var differY = curPos.y - beganPos.y;

            if (Math.abs(differY) > 10)
            {
                //如果回调尚未执行，则执行回调事件
                if (!this._moveEventPerformed)
                {
                    //标记为已执行
                    this._moveEventPerformed = true;

                    if (differY > 0)
                    {
                        this._onTouchMoveEvent(this._moveCaller, MoveDirection.up);
                    }
                    else
                    {
                        this._onTouchMoveEvent(this._moveCaller, MoveDirection.down);
                    }
                }
            }
        }
        else if (type == ccui.Widget.TOUCH_ENDED
            || type == ccui.Widget.TOUCH_CANCELED)
        {
            this._moveEventPerformed = false;
        }
    },
    onTouchJumpBtn: function (caller, type) {
        if (type == ccui.Widget.TOUCH_BEGAN)
        {
            this._onTouchJumpEvent(this._jumpCaller);
        }
    },
    onTouchUpBtn: function (caller, type) {
        if (type == ccui.Widget.TOUCH_BEGAN)
        {
            this._onTouchMoveEvent(this._moveCaller, MoveDirection.up);
        }
    },
    onTouchDownBtn: function (caller, type) {
        if (type == ccui.Widget.TOUCH_BEGAN)
        {
            this._onTouchMoveEvent(this._moveCaller, MoveDirection.down);
        }
    },
    onTouchPauseBtn: function (caller, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.playButtonEffect();
            this._onTouchPauseEvent(this._pauseEventCaller);
        }
    },
    initKeyboardTouch: function () {
        var self = this;
        if ('keyboard' in cc.sys.capabilities) {
            self._listener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    if (cc.KEY["w"] == key)
                    {
                        self._upBtn.setHighlighted(true);
                        //self.onTouchUpBtn(null, ccui.Widget.TOUCH_BEGAN);
                    }
                    else if (cc.KEY["s"] == key)
                    {
                        self._downBtn.setHighlighted(true);
                        //self.onTouchDownBtn(null, ccui.Widget.TOUCH_BEGAN);
                    }
                    else if (cc.KEY["l"] == key)
                    {
                        self._pauseBtn.setHighlighted(true);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        self._jumpBtn.setHighlighted(true);
                        //self.onTouchJumpBtn(null, ccui.Widget.TOUCH_BEGAN);
                    }
                },
                onKeyReleased: function (key, event) {
                    if (cc.KEY["w"] == key)
                    {
                        self._upBtn.setHighlighted(false);
                        self.onTouchUpBtn(null, ccui.Widget.TOUCH_BEGAN);
                    }
                    else if (cc.KEY["s"] == key)
                    {
                        self._downBtn.setHighlighted(false);
                        self.onTouchDownBtn(null, ccui.Widget.TOUCH_BEGAN);
                    }
                    else if (cc.KEY["l"] == key)
                    {
                        self._pauseBtn.setHighlighted(false);
                        self.onTouchPauseBtn(self._pauseBtn, ccui.Widget.TOUCH_ENDED);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        self._jumpBtn.setHighlighted(false);
                        self.onTouchJumpBtn(null, ccui.Widget.TOUCH_BEGAN);
                    }
                }
            });
            cc.eventManager.addListener(self._listener, this);
        }
    },
    enableKeyboard: function () {
        if (this._listener == null)
        {
            this.initKeyboardTouch();
        }
    },
    disableKeyboard: function () {
        if (this._listener)
        {
            cc.eventManager.removeListener(this._listener);
            this._listener = null;
        }
    }
})