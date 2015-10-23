/**
 * Created by qianmengxi on 15-7-7.
 */
var MsgBox = cc.Node.extend({
    _confirmSender:null,
    _closeSender:null,
    _confirmListener:null,
    _closeListener:null,
    _contentText:null,
    _arg1:null,
    _arg2:null,
    _listener:null,
    ctor: function () {
        this._super();

        var baseNode = ParseUIFile("res/MsgBox.json");
        this.addChild(baseNode);

        this._contentText = ccui.helper.seekWidgetByName(baseNode, "Text_content");
        this._closeBtn = ccui.helper.seekWidgetByName(baseNode, "Button_close");
        this._confirmBtn = ccui.helper.seekWidgetByName(baseNode, "Button_confirm");
        this._closeBtn.addTouchEventListener(this.onTouchCloseBtn, this);
        this._confirmBtn.addTouchEventListener(this.onTouchConfirmBtn, this);

        this.initKeyboardTouch();
    },
    setContent: function (str) {
        this._contentText.setString(str);
    },
    setConfrimEventListener: function (sender, listener, arg1, arg2) {
        this._confirmSender = sender;
        this._confirmListener = listener;
        this._arg1 = arg1;
        this._arg2 = arg2;
    },
    setCloseEventListener: function (sender, listener) {
        this._closeSender = sender;
        this._closeListener = listener;
    },
    onTouchCloseBtn: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type)
        {
            SoundManager.playButtonEffect();

            if (this._closeListener)
            {
                this._closeListener.call(this._closeSender);
            }

            this.removeFromParent();
        }
    },
    onTouchConfirmBtn: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type)
        {
            SoundManager.playButtonEffect();

            if (this._confirmListener)
            {
                this._confirmListener.call(this._confirmSender, this._arg1, this._arg2);
            }

            this.removeFromParent();
        }
    },
    initKeyboardTouch: function () {
        var self = this;
        if ('keyboard' in cc.sys.capabilities) {
            self._listener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                },
                onKeyReleased: function (key, event) {
                    if (cc.KEY["l"] == key)
                    {
                        self.onTouchCloseBtn(self._closeBtn, ccui.Widget.TOUCH_ENDED);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        self.onTouchConfirmBtn(self._confirmBtn, ccui.Widget.TOUCH_ENDED);
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