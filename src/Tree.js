/**
 * Created by qianmengxi on 15-6-1.
 */
var Tree = cc.Node.extend({
    _filename:0,
    ctor: function (filename) {
        this._super();
        this._filename = filename;
    },
    onEnter: function () {
        this._super();

        var path = "Common/" + this._filename;
        var sp = new ccui.ImageView(path, ccui.Widget.PLIST_TEXTURE);
        sp.setAnchorPoint(cc.p(0, 0));
        this.addChild(sp);
    }
});