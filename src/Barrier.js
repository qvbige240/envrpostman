/**
 * Created by qianmengxi on 15-6-4.
 */
var Barrier = cc.Node.extend({
    _halfWidth:0.0,
    _path:"",
    _remove:false,
    ctor: function (type) {
        this._super();
        this._typeID = type;
        switch (type)
        {
            case 1:
            {
                this._path = "Common/_0035.png";
                this._halfWidth = 30;
                break;
            }

            case 2:
            {
                this._path = "Common/_0035a.png";
                this._halfWidth = 30;
                break;
            }

            case 3:
            {
                this._path = "Common/_0035b.png";
                this._halfWidth = 30;
                break;
            }

            default :
                break;
        }
    },
    onEnter: function () {
        this._super();

        var sp = new ccui.ImageView(this._path, ccui.Widget.PLIST_TEXTURE);
        sp.setAnchorPoint(cc.p(0.5, 0.35));
        this.addChild(sp);
    },
    removeFromRoad: function () {
        this._remove = true;
    },
    hasRemovedFromRoad: function () {
        return this._remove;
    },
    getType: function () {
        return ItemType.barrier;
    },
    getHalfWidth: function () {
        return this._halfWidth;
    }
});

var DropBarrier = cc.Node.extend({
    _halfWidth:0,
    _remove:false,
    _animation:null,
    ctor: function () {
        this._super();

        //this._animation = new sp.SkeletonAnimation("res/spine/luoshi/luoshi.json", "res/spine/luoshi/luoshi.atlas");
        this._animation = createSkeletonAnimation("luoshi", "res/spine/luoshi/luoshi.json", "res/spine/luoshi/luoshi.atlas");
        this._animation.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(this._animation);

        this._halfWidth = 30;
    },
    removeFromRoad: function () {
        this._remove = true;
    },
    hasRemovedFromRoad: function () {
        return this._remove;
    },
    getType: function () {
        return ItemType.barrier;
    },
    getHalfWidth: function () {
        return this._halfWidth;
    },
    playDropAnimation: function (callback) {
        var self = this;
        this._animation.setAnimation(0, "luoshi1", false);
        this._animation.addAnimation(0, "luoshi2", false);
        this._animation.setEndListener(function (trackIndex) {
            var entry = self._animation.getCurrent(trackIndex);
            if(entry){
                var animationName = entry.animation ? entry.animation.name : "";
                if (animationName == "luoshi2")
                {
                    //callback();
                    cc.log("playDropAnimation");
                    self._remove = false;
                }
            }
        });
    },
    playToBarrierAnimation: function () {
        this._animation.setAnimation(0, "luoshi2", false);
    }
});

var ThornBarrier = cc.Node.extend({
    _halfWidth:0.0,
    _path:"",
    _remove:false,
    ctor: function () {
        this._super();
        var sp = new ccui.ImageView("Common/_0088.png", ccui.Widget.PLIST_TEXTURE);
        sp.setAnchorPoint(cc.p(0.5, 0.35));
        this.addChild(sp);

        this._halfWidth = 405;
    },
    removeFromRoad: function () {
        this._remove = true;
    },
    hasRemovedFromRoad: function () {
        return this._remove;
    },
    getType: function () {
        return ItemType.barrier;
    },
    getHalfWidth: function () {
        return this._halfWidth;
    }
});