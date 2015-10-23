/**
 * Created by qianmengxi on 15-7-7.
 */
var getSkeletonData = function (name, jsonPath, atlasPath, scale) {
    if (SkeletonCache[name] == undefined)
    {

        var data = cc.loader.getRes(atlasPath);
        sp._atlasLoader.setAtlasFile(atlasPath);
        var atlas = new spine.Atlas(data, sp._atlasLoader);

        var attachmentLoader = new spine.AtlasAttachmentLoader(atlas);
        var skeletonJsonReader = new spine.SkeletonJson(attachmentLoader);
        skeletonJsonReader.scale = scale || 1 / cc.director.getContentScaleFactor();

        var skeletonJson = cc.loader.getRes(jsonPath);
        SkeletonCache[name] = skeletonJsonReader.readSkeletonData(skeletonJson);
        atlas.dispose(skeletonJsonReader);
    }

    return SkeletonCache[name];
}

var createSkeletonAnimation = function (key, jsonPath, atlasPath, scale) {
    if (cc.sys.isNative)
    {
        return new sp.SkeletonAnimation(jsonPath, atlasPath, scale || 1);
    }
    else
    {
        var skeletonData = getSkeletonData(key, jsonPath, atlasPath, scale);
        var ani = new sp.SkeletonAnimation(skeletonData, false);
        return ani;
    }
}