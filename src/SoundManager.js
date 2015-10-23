/**
 * Created by qianmengxi on 15-6-19.
 */
    var bMusicOpen = true;
var bBgmOpen = true;
//var BgmPath = GlobalData["sound"]["Menu_bgm"];
var BgmPath = "res/Sound/menu_bgm.mp3";
var SoundManager = {
    isMusicOpen: function () {
        return bMusicOpen;
    },
    openSound: function () {
        bMusicOpen = true;
        if (bBgmOpen) {
            cc.audioEngine.playMusic(BgmPath, true);
            cc.audioEngine.rewindMusic();
        }
    },
    closeSound: function () {
        bMusicOpen = false;
        cc.audioEngine.stopMusic();
    },
    openBgm: function () {
        bBgmOpen = true;
        if (bMusicOpen)
        {
            cc.audioEngine.playMusic(BgmPath, true);
            cc.audioEngine.rewindMusic();
        }
    },
    closeBgm: function () {

        bBgmOpen = false;
        cc.audioEngine.stopMusic();
    },
    playMainBGM: function () {
        if (bMusicOpen && bBgmOpen)
        {
            var musicJson = InitData.getMusicJson();
            BgmPath = PreSoundPath + musicJson["Menu_bgm"];

            cc.log("play main bgm, path:%s", BgmPath);
            cc.audioEngine.playMusic(BgmPath, true);
            cc.audioEngine.rewindMusic();
        }
    },
    playLevelBGM: function (levelName) {
        if (bMusicOpen && bBgmOpen)
        {
            var levelJson = InitData.getLevelJson(levelName);
            if (levelJson != undefined && levelJson["bgm"] != undefined)
            {
                cc.log("play bgm. level name:%s, sound path:%s", levelName, PreSoundPath + levelJson["bgm"]);
                BgmPath = PreSoundPath + levelJson["bgm"];
                cc.audioEngine.playMusic(BgmPath, true);
                cc.audioEngine.rewindMusic();
            }
        }
    },
    playSpeedUpEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["get_speed_up"]);
        }
    },
    playCollisionEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["speed_up_kill"]);
        }
    },
    playWinEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["win"]);
        }
    },
    playLoseEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["lose"]);
        }
    },
    playRecordEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["record"]);
        }
    },
    playGetGoldEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["coin_get"]);
        }
    },
    playSelectPostmanEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["new_hero"]);
        }
    },
    playReviveEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["re_start"]);
        }
    },
    playJumpEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["jump"]);
        }
    },
    playJumpFinishEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["landed"]);
        }
    },
    playButtonEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["butten"]);
        }
    },
    playSwitchRoadEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["switch_road"]);
        }
    },
    playWarningEffect: function () {
        if (bMusicOpen)
        {
            var musicJson = InitData.getMusicJson();
            cc.audioEngine.playEffect(PreSoundPath + musicJson["warning"]);
        }
    }
}