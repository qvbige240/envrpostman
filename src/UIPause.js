/**
 * Created by qianmengxi on 15-6-5.
 */
var UIPause = cc.Node.extend({
    _mainLayerDelegate:null,
    _listener:null,
    ctor: function () {
        this._super();

    },
    init: function () {
        if (!this._super())
        {
            return false;
        }

        var baseNode = ParseUIFile("res/Pause.json");
        this.addChild(baseNode, 1, 1);

        this._soundBtn = ccui.helper.seekWidgetByName(baseNode, "Button_sound");
        this._backBtn = ccui.helper.seekWidgetByName(baseNode, "Button_back");
        this._continueBtn = ccui.helper.seekWidgetByName(baseNode, "Button_continue");
        this._subtitleBtn = ccui.helper.seekWidgetByName(baseNode, "Button_subtitle");
        var continueBtn2 = ccui.helper.seekWidgetByName(baseNode, "Button_continue2");

        this._soundBtn.addTouchEventListener(this.onTouchSoundBtn, this);
        this._backBtn.addTouchEventListener(this.onTouchBackBtn, this);
        this._continueBtn.addTouchEventListener(this.onTouchContinueBtn, this);
        continueBtn2.addTouchEventListener(this.onTouchContinueBtn, this);
        this._subtitleBtn.addTouchEventListener(this.onTouchSubtitleBtn, this);

        if (SoundManager.isMusicOpen())
        {
            this._soundBtn.setHighlighted(false);
        }
        else
        {
            this._soundBtn.setHighlighted(true);
        }

        this.initButtonName();
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
        var btnName = InitData.getStringByKey("back");
        AddNameToButton(btnName, this._backBtn);

        var btnName = InitData.getStringByKey("commentOn");
        this.subtitleText = AddNameToButton(btnName, this._subtitleBtn);

        var btnName = InitData.getStringByKey("continue");
        AddNameToButton(btnName, this._continueBtn);
    },
    setMainLayerDelegate: function (delegate) {
        this._mainLayerDelegate = delegate;
        this.checkSubTitleOpen();
    },
    checkSubTitleOpen: function () {
        if (this._mainLayerDelegate.isSubtitleOpen())
        {
            var btnName = InitData.getStringByKey("commentOff");
            this.subtitleText.setString(btnName);
        }
        else
        {
            var btnName = InitData.getStringByKey("commentOn");
            this.subtitleText.setString(btnName);
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
    onTouchBackBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.playButtonEffect();

            //返回主界面
            this.removeFromParent(true);
            this._mainLayerDelegate.recordHighestLength();
            this._mainLayerDelegate.removeFromParent(true);

            var enterUI = new UIEnter();
            enterUI.init();
            cc.director.getRunningScene().addChild(enterUI);
        }
    },
    onTouchContinueBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.playButtonEffect();

            if (this._mainLayerDelegate) {
                this._mainLayerDelegate.resumeGame();
                this.removeFromParent(true);
            }
        }
    },
    onTouchSubtitleBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            SoundManager.playButtonEffect();

            if (this._mainLayerDelegate.isSubtitleOpen())
            {
                //sender.setHighlighted(true);
                this._mainLayerDelegate.closeSubtitle();

                var btnName = InitData.getStringByKey("commentOn");
                this.subtitleText.setString(btnName);
            }
            else
            {
                //sender.setHighlighted(false);
                this._mainLayerDelegate.openSubtitle();

                var btnName = InitData.getStringByKey("commentOff");
                this.subtitleText.setString(btnName);
            }
        }
    },
    initKeyboardTouch: function () {
        var self = this;
        if ('keyboard' in cc.sys.capabilities) {
            self._listener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    if (cc.KEY["l"] == key)
                    {
                        self._backBtn.setHighlighted(true);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        self._continueBtn.setHighlighted(true);
                    }
                    else if (cc.KEY["i"] == key)
                    {
                        self._soundBtn.setHighlighted(true);
                    }
                    else if (cc.KEY["k"] == key)
                    {
                        self._subtitleBtn.setHighlighted(true);
                    }
                },
                onKeyReleased: function (key, event) {
                    var keyStr = GetKeyStr(key);
                    if (keyStr.length > 0)
                    {
                        if (cc.KEY["l"] == key)
                        {
                            self._backBtn.setHighlighted(false);
                            self.onTouchBackBtn(self._backBtn, ccui.Widget.TOUCH_ENDED);
                        }
                        else if (cc.KEY["j"] == key)
                        {
                            self._continueBtn.setHighlighted(false);
                            self.onTouchContinueBtn(self._continueBtn, ccui.Widget.TOUCH_ENDED);
                        }
                        else if (cc.KEY["i"] == key)
                        {
                            self._soundBtn.setHighlighted(true);
                            self.onTouchSoundBtn(self._soundBtn, ccui.Widget.TOUCH_ENDED);
                        }
                        else if (cc.KEY["k"] == key)
                        {
                            self._subtitleBtn.setHighlighted(true);
                            self.onTouchSubtitleBtn(self._subtitleBtn, ccui.Widget.TOUCH_ENDED);
                        }
                    }
                }
            });
            cc.eventManager.addListener(self._listener, this);
        }
    },
    disableKeyboard: function () {
        if (this._listener)
        {
            cc.eventManager.removeListener(this._listener);

        }
    }
});