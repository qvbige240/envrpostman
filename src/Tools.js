/**
 * Created by qianmengxi on 15-6-2.
 */
var GameRandomFloat = function (low, high) {
    if (low === undefined) low = 0;
    if (high === undefined) high = 0;
    return (high - low) * Math.random() + low;
}

var GameRandomInt = function (low, high) {
    if (low === undefined) low = 0;
    if (high === undefined) high = 0;
    //加1为了包含high
    return Math.floor((high + 1 - low) * Math.random() + low);
}

var ParseUIFile = function (file) {
    var json = ccs.load(file);
    return json.node;
}

var LocalStorage = {
    set: function (key, value) {
        cc.sys.localStorage.setItem(key, value);
    },
    get: function (key) {
        return cc.sys.localStorage.getItem(key);
    }
}

var ParseJsonFile = function (file) {
    return cc.loader.getRes(file);
}

//文字提示
var ShowMsgTips = function (msg, delayTime) {
    var winSize = cc.director.getWinSizeInPixels();
    var msgText = new ccui.Text(msg, "res/Font/DFWaWaW5.TTF", 60);
    msgText.setTouchEnabled(false);
    msgText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    msgText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    msgText.setPosition(winSize.width/2, winSize.height/2);
    cc.director.getRunningScene().addChild(msgText, 100);

    var _delayTime = (delayTime == undefined)?1.0:delayTime;
    var delay = cc.delayTime(_delayTime);
    var fadeout = cc.fadeOut(0.3);
    var callFunc = cc.callFunc(function () {
        msgText.removeFromParent();
    });
    msgText.runAction(cc.sequence(delay, fadeout, callFunc));
}

var GetKeyStr = function (keycode)
{
    if (keycode == cc.KEY.none)
    {
        return "";
    }

    for (var keyTemp in cc.KEY)
    {
        if (cc.KEY[keyTemp] == keycode)
        {
            return keyTemp;
        }
    }
    return "";
}

var AddNameToButton = function (name, button) {
    var size = button.getContentSize();
    var nameText = new ccui.Text(name, "res/Font/DFWaWaW5.TTF", 36);
    nameText.setTouchEnabled(false);
    nameText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    nameText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    nameText.setPosition(size.width/2, size.height/2);
    button.addChild(nameText);

    return nameText;
}