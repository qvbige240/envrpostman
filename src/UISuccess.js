/**
 * Created by qianmengxi on 15-6-16.
 */
var UISuccess = cc.Node.extend({
    _animationNode:null,
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

        var baseNode = ParseUIFile("res/Success.json");
        this.addChild(baseNode);

        this._nextBtn = ccui.helper.seekWidgetByName(baseNode, "Button_next");
        this._returnBtn = ccui.helper.seekWidgetByName(baseNode, "Button_return");
        this._animationNode = ccui.helper.seekWidgetByName(baseNode, "Panel_animation");

        this._nextBtn.addTouchEventListener(this.onTouchNextBtn, this);
        this._returnBtn.addTouchEventListener(this.onTouchReturnBtn, this);

        this.playSuccessAnimation();

        this.initButtonName();
        //键盘操作
        var keyboardPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_keyboard");
        keyboardPanel.setVisible(EnableKeyboard);
        this.initKeyboardTouch();

        return true;
    },
    onEnter: function () {
        this._super();
        cc.log("UISuccess onenter");
        //this.initKeyboardTouch();
    },
    onExit: function () {
        this._super();
        cc.log("UISuccess onExit");
        //cc.eventManager.removeListener(cc.EventListener.KEYBOARD)
    },
    initButtonName: function () {
        var btnName = InitData.getStringByKey("back");
        AddNameToButton(btnName, this._returnBtn);

        var btnName = InitData.getStringByKey("next");
        AddNameToButton(btnName, this._nextBtn);
    },
    playSuccessAnimation: function () {
        var successSpine = null;
        if (IsChinese)
        {
            successSpine = createSkeletonAnimation("shengli", "res/spine/shengli/shengli.json", "res/spine/shengli/shengli.atlas");
        }
        else
        {
            successSpine = createSkeletonAnimation("shengli", "res/spine/shenglia/shenglia.json", "res/spine/shenglia/shenglia.atlas");
        }
        successSpine.setAnimation(0, "haoping1", false);
        successSpine.addAnimation(0, "haoping2", true);
        this._animationNode.addChild(successSpine);
    },
    setMainLayerDelegate: function (delegate) {
        this._mainLayerDelegate = delegate;
    },
    onTouchNextBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.openBgm();
            SoundManager.playButtonEffect();

            var nextLevelName = InitData.getNextLevelNameByCurName(this._mainLayerDelegate._levelName);
            cc.log("nextLevelName:%s", nextLevelName);
            if (nextLevelName != "")
            {
                var mainUI = new MainLayer(nextLevelName);
                mainUI.init();
                mainUI.setPosition(0, -cc.visibleRect.height);
                cc.director.getRunningScene().addChild(mainUI);

                //战斗界面显示后，调用开始游戏回调
                var callFunc = cc.callFunc(function (sender, value) {
                    sender.start();
                });
                MoveUpWithCallFunc(mainUI, callFunc);
                MoveUp(this._mainLayerDelegate, true);
                MoveUp(this, true);
            }
        }
    },
    onTouchReturnBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.openBgm();
            SoundManager.playButtonEffect();

            //返回主界面
            this._mainLayerDelegate.removeFromParent(true);
            this.removeFromParent(true);

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
                        self._nextBtn.setHighlighted(true);
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
                        self._nextBtn.setHighlighted(false);
                        self.onTouchNextBtn(self._nextBtn, ccui.Widget.TOUCH_ENDED);
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
})