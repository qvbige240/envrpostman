/**
 * Created by qianmengxi on 15-6-5.
 */
    //金币道具
var ItemGold = cc.Node.extend({
    _enable:true,
    ctor: function () {
        this._super();
    },
    init: function () {
        if (!this._super())
        {
            return false;
        }

        this._animation = createSkeletonAnimation("daoju1", "res/spine/jinbitx/daoju2.json", "res/spine/jinbitx/daoju2.atlas");
        this._animation.setAnchorPoint(cc.p(0.5, 0));
        this.addChild(this._animation);
        
        return true;
    },
    getType: function () {
        return ItemType.gold;
    },
    getHalfWidth: function () {
        return 30;
    },
    setItemEnable: function (bEnable) {
        this._enable = bEnable;
    },
    isItemEnable: function () {
        return this._enable;
    },
    playNormalAction: function () {
        this._animation.setAnimation(0, "jb1", true);
    },
    playDisappearAction: function () {
        this._animation.setAnimation(0, "jb2", false);
    }
});

//加速道具
var ItemAccelerator = cc.Node.extend({
    _enable:true,
    ctor: function () {
        this._super();
    },
    init: function () {
        if (!this._super())
        {
            return false;
        }

        //this._animation = new sp.SkeletonAnimation("res/spine/jiasutx/daoju2.json", "res/spine/jiasutx/daoju2.atlas");
        this._animation = createSkeletonAnimation("daoju2", "res/spine/jiasutx/daoju2.json", "res/spine/jiasutx/daoju2.atlas");
        this._animation.setAnchorPoint(cc.p(0.5, 0));
        this.addChild(this._animation);
        
        return true;
    },
    getHalfWidth: function () {
        return 30;
    },
    setItemEnable: function (bEnable) {
        this._enable = bEnable;
    },
    isItemEnable: function () {
        return this._enable;
    },
    getType: function () {
        return ItemType.accelerator;
    },
    playNormalAction: function () {
        this._animation.setAnimation(0, "js1", true);
    },
    playSpeedupAction: function () {
        this._animation.setAnimation(0, "js2", false);
    }
})