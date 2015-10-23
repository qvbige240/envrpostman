/**
 * Created by qianmengxi on 15-6-5.
 */
var UIFail = cc.Node.extend({
    _animationNode:null,
    _mainLayerDelegate:null,
    _touchEnable:true,
    _listener:null,
    ctor: function () {
        this._super();
    },
    init: function () {
        if (!this._super())
        {
            return false;
        }

        var baseNode = ParseUIFile("res/Failed.json");
        this.addChild(baseNode);

        this._restartBtn = ccui.helper.seekWidgetByName(baseNode, "Button_restart");
        this._returnBtn = ccui.helper.seekWidgetByName(baseNode, "Button_return");
        //var reviveBtn = ccui.helper.seekWidgetByName(baseNode, "Button_alive");
        this._animationNode = ccui.helper.seekWidgetByName(baseNode, "Panel_animation");

        this._restartBtn.addTouchEventListener(this.onTouchRestartBtn, this);
        this._returnBtn.addTouchEventListener(this.onTouchReturnBtn, this);

        this.playFailedAnimation();
        this.scheduleUpdate();

        this.initButtonName();
        //键盘操作
        var keyboardPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_keyboard");
        keyboardPanel.setVisible(EnableKeyboard);
        this.initKeyboardTouch();

        return true;
    },
    onEnter: function () {
        this._super();
        cc.log("UIFail onenter");
        //this.initKeyboardTouch();
    },
    onExit: function () {
        this._super();
        cc.log("UIFail onExit");
        //cc.eventManager.removeListener(cc.EventListener.KEYBOARD)
    },
    initButtonName: function () {
        var btnName = InitData.getStringByKey("back");
        AddNameToButton(btnName, this._returnBtn);

        var btnName = InitData.getStringByKey("again");
        AddNameToButton(btnName, this._restartBtn);
    },
    playFailedAnimation: function () {
        var failSpine = null;
        if (IsChinese)
        {
            failSpine = createSkeletonAnimation("shibai", "res/spine/shibai/shibai.json", "res/spine/shibai/shibai.atlas");
        }
        else
        {
            failSpine = createSkeletonAnimation("shibai", "res/spine/shibaia/shibaia.json", "res/spine/shibaia/shibaia.atlas");
        }

        failSpine.setAnimation(0, "shibai1", false);
        failSpine.addAnimation(0, "shibai2", true);
        this._animationNode.addChild(failSpine);
    },
    setMainLayerDelegate: function (delegate) {
        this._mainLayerDelegate = delegate;
    },
    onTouchRestartBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.playButtonEffect();

            this.removeFromParent();
            this._mainLayerDelegate.reset();
            this._mainLayerDelegate.start();
        }
    },
    onTouchReturnBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.playButtonEffect();

            //返回主界面
            this.removeFromParent(true);
            this._mainLayerDelegate.removeFromParent(true);

            var enterUI = new UIEnter();
            enterUI.init();
            cc.director.getRunningScene().addChild(enterUI);
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
                        self._returnBtn.setHighlighted(true);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        self._restartBtn.setHighlighted(true);
                    }
                },
                onKeyReleased: function (key, event) {
                    if (cc.KEY["l"] == key)
                    {
                        self._returnBtn.setHighlighted(false);
                        self.onTouchReturnBtn(self._returnBtn, ccui.Widget.TOUCH_ENDED);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        self._restartBtn.setHighlighted(false);
                        self.onTouchRestartBtn(self._restartBtn, ccui.Widget.TOUCH_ENDED);
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
            this._listener = null;
        }
    }
    /*
    delayTouch: function () {
        this._touchEnable = false;
        var delay = cc.delayTime(15.0);
        var callFunc = cc.callFunc(function (sender, value) {
            sender._touchEnable = true;
        })
        this.runAction(cc.sequence(delay, callFunc));
    }
    */
})