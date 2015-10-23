/**
 * Created by qianmengxi on 15-6-18.
 */
var InitData = {
    getAllLevels: function () {
        return GlobalData["level"];
    },
    getLevelJson: function (levelName) {
        var allLevelJson = GlobalData["level"];
        if (allLevelJson != undefined)
        {
            return allLevelJson[levelName];
        }
        else
        {
            cc.log("level init data not found!");
        }
    },
    getNextLevelNameByCurName: function (curLevelName) {
        var isNext = false;
        var retName = "";
        var allLevelJson = GlobalData["level"];
        for (var levelName in allLevelJson)
        {
            if (isNext)
            {
                retName = levelName;
                break;
            }
            else if (curLevelName == levelName)
            {
                isNext = true;
            }
        }

        return retName;
    },
    getMonsterJson: function (monsterName) {
        var allMonstersJson = GlobalData["monster"];
        if (allMonstersJson != undefined)
        {
            return allMonstersJson[monsterName];
        }
        else
        {
            cc.log("monster init data not found!");
        }
    },
    getAllPostman: function () {
        return GlobalData["hero"];
    },
    getPostmanJson: function (postmanName) {
        var allPostmansJson = GlobalData["hero"];
        if (allPostmansJson != undefined)
        {
            return allPostmansJson[postmanName];
        }
        else
        {
            cc.log("postman init data not found!");
        }
    },
    getMusicJson: function () {
        return GlobalData["sound"];
    },
    getSubTitleArray: function (type) {
        switch (type)
        {
            case SubTitleType.speedup:
            {
                return GlobalData["Caption"]["speed_up"];
            }

            case SubTitleType.runing:
            {
                return GlobalData["Caption"]["runing"];
            }

            case SubTitleType.gold:
            {
                return GlobalData["Caption"]["got_coin"];
            }

            case SubTitleType.dead:
            {
                return GlobalData["Caption"]["dead"];
            }

            default :
                break;
        }

        return null;
    },
    getStringByKey: function (key) {
        var str = GlobalData["string"];
        if (str && str[key])
        {
            return str[key];
        }

        return "";
    }
}