/**
 * Created by qianmengxi on 15-6-2.
 */
var UIEnter = cc.Node.extend({
    _goldText:null,
    _postmanPanel:null,
    _listener:null,
    init: function () {
        if (!this._super())
        {
            return false;
        }

        var baseNode = ParseUIFile("res/Login.json");
        this.addChild(baseNode);

        this._soundBtn = ccui.helper.seekWidgetByName(baseNode, "Button_sound");
        this._heroBtn = ccui.helper.seekWidgetByName(baseNode, "Button_hero");
        this._exitBtn = ccui.helper.seekWidgetByName(baseNode, "Button_charge");
        this._playBtn = ccui.helper.seekWidgetByName(baseNode, "Button_play");

        this._goldText = ccui.helper.seekWidgetByName(baseNode, "Text_gold");
        this._postmanPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_postman");

        this._soundBtn.addTouchEventListener(this.onTouchSoundBtn, this);
        this._heroBtn.addTouchEventListener(this.onTouchHeroBtn, this);
        this._exitBtn.addTouchEventListener(this.onTouchExitBtn, this);
        this._playBtn.addTouchEventListener(this.onTouchPlayBtn, this);

        var defaultName = GameStorage.getDefaultPostmanName();
        if (defaultName == undefined || defaultName == "")
        {
            GameStorage.setDefaultPostmanName("zhujue");
            GameStorage.enableHero("zhujue");
            GameStorage.openLevel("map_1");
            //TODO:only for test
            GameStorage.setUserGold(2000);
            GlobalGold = 2000;
        }

        this.initButtonName();
        this.refreshPostmanAnimation();
        this.refreshGoldText();

        if (SoundManager.isMusicOpen())
        {
            this._soundBtn.setHighlighted(false);
            SoundManager.playMainBGM();
        }
        else
        {
            this._soundBtn.setHighlighted(true);
        }

        this.scheduleUpdate();

        //键盘操作
        var keyboardPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_keyboard");
        keyboardPanel.setVisible(EnableKeyboard);
        this.initKeyboardTouch();

        return true;
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    initButtonName: function () {
        var btnName = InitData.getStringByKey("postman");
        AddNameToButton(btnName, this._heroBtn);

        btnName = InitData.getStringByKey("exit");
        AddNameToButton(btnName, this._exitBtn);

        btnName = InitData.getStringByKey("go");
        AddNameToButton(btnName, this._playBtn);
    },
    update:function(dt){
        this.refreshGoldText();
    },
    refreshPostmanAnimation: function () {
        //读取配置表
        this._postmanPanel.removeAllChildren();
        var postman = new Postman(GameStorage.getDefaultPostmanName());
        postman.init();
        postman.playWalk();
        this._postmanPanel.addChild(postman);
    },
    refreshGoldText: function () {
        this._goldText.setString(GlobalGold);
    },
    onTouchPlayBtn:function (sender, type){
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboardTouch();
            SoundManager.playButtonEffect();
            sender.setTouchEnabled(false);

            //显示选关界面
            var uiLevel = new UILevelEx();
            uiLevel.setPosition(cc.visibleRect.width, 0);
            uiLevel.init();
            cc.director.getRunningScene().addChild(uiLevel);

            MoveLeft(this, true);
            MoveLeft(uiLevel, false);
        }
    },
    onTouchSoundBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            if (SoundManager.isMusicOpen())
            {
                SoundManager.playButtonEffect();
                sender.setHighlighted(true);
                SoundManager.closeSound();
            }
            else
            {
                sender.setHighlighted(false);
                SoundManager.openSound();
            }
        }
    },
    onTouchHeroBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboardTouch();
            SoundManager.playButtonEffect();

            var postmanUI = new UIPostmanEx();
            postmanUI.init();
            postmanUI.setUIEnterDelegate(this);
            cc.director.getRunningScene().addChild(postmanUI);
        }
    },
    onTouchExitBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboardTouch();
            SoundManager.playButtonEffect();

            var content = "";
            if (IsChinese)
            {
                content = "确定要退出游戏？";
            }
            else
            {
                content = "Do you really want to quit the game?";
            }
            var msgBox = new MsgBox();
            msgBox.setContent(content);
            msgBox.setCloseEventListener(this, this.onCancleExit);
            msgBox.setConfrimEventListener(this, this.onConfirmExit, null, null);
            cc.director.getRunningScene().addChild(msgBox);
        }
    },
    onCancleExit: function () {
        this.enableKeyboardTouch();
    },
    onConfirmExit: function () {
        cc.director.end();
    },
    initKeyboardTouch: function () {
        var self = this;
        if ('keyboard' in cc.sys.capabilities) {
            self._listener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    cc.log("onKeyPressed key:%d", key);
                    //ShowMsgTips("onKeyPressed key"+key);
                    if (cc.KEY["i"] == key)
                    {
                        self._soundBtn.setHighlighted(true);
                    }
                    else if (key == cc.KEY["k"])
                    {
                        self._heroBtn.setHighlighted(true);
                    }
                    else if (key == cc.KEY["l"])
                    {
                        self._exitBtn.setHighlighted(true);
                    }
                    else if (key == cc.KEY["j"])
                    {
                        self._playBtn.setHighlighted(true);
                    }
                },
                onKeyReleased: function (key, event) {
                    cc.log("onKeyReleased key:%d", key);
                    if (cc.KEY["i"] == key)
                    {
                        self._soundBtn.setHighlighted(false);
                        self.onTouchSoundBtn(self._soundBtn, ccui.Widget.TOUCH_ENDED);
                    }
                    else if (cc.KEY["k"] == key)
                    {
                        self._heroBtn.setHighlighted(false);
                        self.onTouchHeroBtn(self._heroBtn, ccui.Widget.TOUCH_ENDED);
                    }
                    else if (cc.KEY["l"] == key)
                    {
                        self._exitBtn.setHighlighted(false);
                        self.onTouchExitBtn(self._exitBtn, ccui.Widget.TOUCH_ENDED);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        self._playBtn.setHighlighted(false);
                        self.onTouchPlayBtn(self._playBtn, ccui.Widget.TOUCH_ENDED);
                    }
                }
            });
            cc.eventManager.addListener(self._listener, this);
        }
    },
    disableKeyboardTouch: function () {
        if (this._listener)
        {
            cc.eventManager.removeListener(this._listener);
            this._listener = null;
        }
    },
    enableKeyboardTouch: function () {
        if (this._listener == null)
        {
            this.initKeyboardTouch();
        }
    }
})