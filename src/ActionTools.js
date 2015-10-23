/**
 * Created by qianmengxi on 15-6-11.
 */
var MoveRight = function (caller, bRemove) {
    var moveBy = cc.moveBy(0.5, cc.p(cc.visibleRect.width, 0));
    if (bRemove != undefined && bRemove)
    {
        var callFunc = cc.callFunc(function(sender, value){
            sender.removeFromParent(true);
        });
        caller.runAction(cc.sequence(moveBy, callFunc));
    }
    else
    {
        caller.runAction(moveBy);
    }
}

var MoveLeft = function (caller, bRemove) {
    var moveBy = cc.moveBy(0.5, cc.p(-cc.visibleRect.width, 0));
    if (bRemove != undefined && bRemove)
    {
        var callFunc = cc.callFunc(function(sender, value){
            sender.removeFromParent(true);
        });
        caller.runAction(cc.sequence(moveBy, callFunc));
    }
    else
    {
        caller.runAction(moveBy);
    }
}

var MoveUp = function (caller, bRemove) {
    var moveBy = cc.moveBy(0.5, cc.p(0, cc.visibleRect.height));
    if (bRemove != undefined && bRemove)
    {
        var callFunc = cc.callFunc(function(sender, value){
            sender.removeFromParent(true);
        });
        caller.runAction(cc.sequence(moveBy, callFunc));
    }
    else
    {
        caller.runAction(moveBy);
    }
}

var MoveUpWithCallFunc = function (caller, callFunc) {
    var moveBy = cc.moveBy(0.5, cc.p(0, cc.visibleRect.height));
    if (callFunc != undefined)
    {
        caller.runAction(cc.sequence(moveBy, callFunc));
    }
    else
    {
        caller.runAction(moveBy);
    }
}

var MoveDown = function (caller, bRemove) {
    var moveBy = cc.moveBy(0.5, cc.p(0, -cc.visibleRect.height));
    if (bRemove != undefined && bRemove)
    {
        var callFunc = cc.callFunc(function(sender, value){
            sender.removeFromParent(true);
        });
        caller.runAction(cc.sequence(moveBy, callFunc));
    }
    else
    {
        caller.runAction(moveBy);
    }
}