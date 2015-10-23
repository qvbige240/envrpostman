/**
 * Created by qianmengxi on 15-6-18.
 */
var GameStorage = {
    setLevelClear: function (levelName) {
        var key = "Clear_" + levelName;
        LocalStorage.set(key, 1);
    },
    isLevelClear: function (levelName) {
        var key = "Clear_" + levelName;
        var value = LocalStorage.get(key);
        return (value == 1)?true:false;
    },
    openLevel: function (levelName) {
        var key = "Open_" + levelName;
        LocalStorage.set(key, 1);
    },
    isLevelOpen: function (levelName) {
        var key = "Open_" + levelName;
        var value = LocalStorage.get(key);
        return (value == 1)?true:false;
    },
    setLevelPassedLength: function (levelName, length) {
        var key = "Length_" + levelName;
        LocalStorage.set(key, length);
    },
    getLevelPassedLength: function (levelName) {
        var key = "Length_" + levelName;
        return Number(LocalStorage.get(key));
    },
    setUserGold: function (gold) {
        var newGold = Number(gold);
        LocalStorage.set("Gold", newGold>0?newGold:0);
    },
    addUserGold: function (add) {
        var addNum = Number(add);
        if (addNum < 0)
        {
            cc.log("addUserGold failed! add:%d", addNum);
        }
        else
        {
            var gold = this.getUserGold();
            this.setUserGold(gold + addNum);
        }
    },
    getUserGold: function () {
        var gold = Number(LocalStorage.get("Gold"));
        return gold > 0?gold:0;
    },
    setDefaultPostmanName: function (postmanName) {
        LocalStorage.set("PostmanName", postmanName);
    },
    getDefaultPostmanName: function () {
        return LocalStorage.get("PostmanName");
    },
    isHeroEnable: function (heroName) {
        var key = "EnableHeros_" + heroName;
        var enable = LocalStorage.get(key);
        cc.log("isHeroEnable:%d, %s", enable, heroName);
        if (enable != undefined && Number(enable) == 1)
        {
            return true;
        }

        return false;
    },
    enableHero: function (heroName) {
        cc.log("enableHero:%s", heroName);
        var key = "EnableHeros_" + heroName;
        LocalStorage.set(key, 1);
    }
}