/**
 * Created by qianmengxi on 15-6-2.
 */
var UILevelEx = cc.Node.extend({
    _pageView:null,
    _pageViewSize:null,
    _levelTouchEnable:true,
    _maxPageIdx:0,
    _maxLevelIdx:0,
    _levelNumPerPage:6,
    //适应键盘操作
    _curLevelIdx:0,
    _selectImg:null,
    _listener:null,
    _forLog:0,
    init: function () {
        if (!this._super())
        {
            return false;
        }

        var baseNode = ParseUIFile("res/Level.json");
        this.addChild(baseNode);

        this._returnBtn = ccui.helper.seekWidgetByName(baseNode, "Button_return");
        this._pageView = ccui.helper.seekWidgetByName(baseNode, "PageView_level");
        this._leftBtn = ccui.helper.seekWidgetByName(baseNode, "Button_left");
        this._rightBtn = ccui.helper.seekWidgetByName(baseNode, "Button_right");
        this._confirmText = ccui.helper.seekWidgetByName(baseNode, "Text_confirm");
        this._leftBtn.setVisible(false);
        this._pageViewSize = this._pageView.getContentSize();
        this._pageView.addEventListener(this.onPageViewEvent, this);
        this._returnBtn.addTouchEventListener(this.onTouchReturn, this);

        this.initPageview();

        //禁止键盘操作
        var keyboardPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_keyboard");
        keyboardPanel.setVisible(EnableKeyboard);

        this._leftBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_left1");
        this._rightBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_right1");
        this._upBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_up1");
        this._downBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_down1");
        //this.initKeyboardTouch();
        this.initSelectImg();
        if (!IsChinese)
        {
            this._confirmText.setString("OK");
        }

        this.initKeyboardTouch();
        return true;
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    initPageview: function () {
        //关卡初始化
        var idx = 0;
        var levelJson = InitData.getAllLevels();
        var page = null;
        for (var levelName in levelJson)
        {
            if (idx%this._levelNumPerPage == 0)
            {
                page = new ccui.Layout();
                page.setContentSize(this._pageViewSize);
            }

            var levelInfo = levelJson[levelName];
            var levelPath = "Common/" + levelInfo["bg_1"];
            var level = this.createLevel(levelName, levelPath, idx);
            level.setPosition(cc.p(this._pageViewSize.width/this._levelNumPerPage*(idx%this._levelNumPerPage), 0));
            page.addChild(level);

            if (idx % this._levelNumPerPage == 0)
            {
                this._pageView.addPage(page);
                this._maxPageIdx ++;
            }

            idx ++;
            this._maxLevelIdx = idx - 1;
        }
    },
    createLevel: function (levelName, path, levelIdx) {
        //cc.log("levelName:%s", levelName);
        //cc.log("levelpath:%s", path);
        //根据levelID配置
        var levelJson = InitData.getAllLevels();
        var levelImg = new ccui.ImageView(path, ccui.Widget.PLIST_TEXTURE);
        levelImg.setAnchorPoint(cc.p(0, 0));
        levelImg.setName(levelName);
        levelImg.setTag(levelIdx);
        levelImg.addTouchEventListener(this.onTouchLevel, this);
        levelImg.setTouchEnabled(true);

        var levelSize = levelImg.getContentSize();
        if (levelJson[levelName]["name"] != undefined)
        {
            var nameText = new ccui.Text(levelJson[levelName]["name"], "res/Font/DFWaWaW5.TTF", 30);
            nameText.setTouchEnabled(false);
            nameText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            nameText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            nameText.setPosition(levelSize.width/2, levelSize.height*41/52);
            levelImg.addChild(nameText);
        }

        //加锁
        var bEnable = GameStorage.isLevelOpen(levelName);
        if (!bEnable)
        {
            var lockImg = new ccui.ImageView("Common/_0040.png", ccui.Widget.PLIST_TEXTURE);
            lockImg.setPosition(cc.p(levelSize.width/2, levelSize.height/2));
            levelImg.addChild(lockImg);
        }

        //无尽关卡最高记录
        var levelMode = levelJson[levelName]["mod"];
        if (levelMode == LevelMode.endless)
        {
            var highestLen = GameStorage.getLevelPassedLength(levelName);
            var recordText = new ccui.Text(highestLen==undefined?0:Math.ceil(highestLen/100), res.Font_path, 36);
            recordText.setPosition(levelSize.width / 2, 195);
            levelImg.addChild(recordText);
        }

        return levelImg;
    },
    onTouchReturn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            this.disableKeyboard();
            SoundManager.playButtonEffect();
            sender.setTouchEnabled(false);

            //返回开始界面
            var enterUI = new UIEnter();
            enterUI.init();
            enterUI.setPosition(-cc.visibleRect.width, 0);
            cc.director.getRunningScene().addChild(enterUI);

            MoveRight(this, true);
            MoveRight(enterUI, false);
        }
    },
    onPageViewEvent: function (pageView, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                //cc.log("pageIdx %d", pageView.getCurPageIndex());
                if (pageView.getCurPageIndex() > 0)
                {
                    this._leftBtn.setVisible(true);
                }
                else
                {
                    this._leftBtn.setVisible(false);
                }

                if (pageView.getCurPageIndex() < this._maxPageIdx-1)
                {
                    this._rightBtn.setVisible(true);
                }
                else
                {
                    this._rightBtn.setVisible(false);
                }
                break;
            default:
                break;
        }
    },
    onTouchLevel: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            var levelName = sender.getName();
            this.onTouchLevelEvent(levelName);
        }
    },
    onTouchLevelEvent: function (levelName) {
        if (this._levelTouchEnable)
        {
            var bEnable = GameStorage.isLevelOpen(levelName);
            if (bEnable)
            {
                this.disableKeyboard();
                SoundManager.playButtonEffect();

                this._levelTouchEnable = false;
                var mainUI = new MainLayer(levelName);
                mainUI.init();
                mainUI.setPosition(0, -cc.visibleRect.height);
                cc.director.getRunningScene().addChild(mainUI);

                //战斗界面显示后，调用开始游戏回调
                var callFunc = cc.callFunc(function (caller, value) {
                    caller.start();
                });
                MoveUpWithCallFunc(mainUI, callFunc);
                MoveUp(this, true);
            }
        }
    },
    initSelectImg: function () {
        var pageIdx = Math.floor(this._curLevelIdx / this._levelNumPerPage);
        var page = this._pageView.getPage(pageIdx);
        var levelImg = page.getChildByTag(this._curLevelIdx);
        if (levelImg)
        {
            this.addSelectImg(levelImg);
        }
    },
    addSelectImg: function (parent) {
        if (this._selectImg) this._selectImg.removeFromParent();
        this._selectImg = new ccui.ImageView("Common/_0112.png", ccui.Widget.PLIST_TEXTURE);
        this._selectImg.setAnchorPoint(0, 0);
        parent.addChild(this._selectImg);
    },
    onTouchLeftEvent: function () {
        if (this._curLevelIdx > 0)
        {
            this._curLevelIdx --;
            var pageIdx = Math.floor(this._curLevelIdx / this._levelNumPerPage);
            var curPageIdx = this._pageView.getCurPageIndex();
            if (pageIdx < curPageIdx)
            {
                this._pageView.scrollToPage(pageIdx);
            }

            var page = this._pageView.getPage(pageIdx);
            if (page)
            {
                var levelImg = page.getChildByTag(this._curLevelIdx);
                if (levelImg) {
                    this.addSelectImg(levelImg);
                }
            }
        }
    },
    onTouchRightEvent: function () {
        if (this._maxLevelIdx > this._curLevelIdx)
        {
            this._curLevelIdx ++;
            var pageIdx = Math.floor(this._curLevelIdx / this._levelNumPerPage);
            var curPageIdx = this._pageView.getCurPageIndex();
            if (pageIdx > curPageIdx)
            {
                this._pageView.scrollToPage(pageIdx);
            }

            var page = this._pageView.getPage(pageIdx);
            if (page)
            {
                var levelImg = page.getChildByTag(this._curLevelIdx);
                if (levelImg)
                {
                    this.addSelectImg(levelImg);
                }
            }
        }
    },
    onSelectLevel: function () {
        var pageIdx = Math.floor(this._curLevelIdx / this._levelNumPerPage);
        var page = this._pageView.getPage(pageIdx);
        if (page)
        {
            var levelImg = page.getChildByTag(this._curLevelIdx);
            if (levelImg)
            {
                var levelName = levelImg.getName();
                var bEnable = GameStorage.isLevelOpen(levelName);
                if (bEnable)
                {
                    this.onTouchLevelEvent(levelName);
                }
            }
        }
    },
    initKeyboardTouch: function () {
        var self = this;
        if ('keyboard' in cc.sys.capabilities) {
            self._listener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    if (cc.KEY["w"] == key)
                    {
                        self._upBtnEx.setHighlighted(true);
                    }
                    else if (cc.KEY["s"] == key)
                    {
                        self._downBtnEx.setHighlighted(true);
                    }
                    else if (cc.KEY["a"] == key) {
                        self._leftBtnEx.setHighlighted(true);
                    }
                    else if (cc.KEY["d"] == key) {
                        self._rightBtnEx.setHighlighted(true);
                    }
                },
                onKeyReleased: function (key, event) {
                    if (cc.KEY["w"] == key)
                    {
                        self._upBtnEx.setHighlighted(false);
                    }
                    else if (cc.KEY["s"] == key)
                    {
                        self._downBtnEx.setHighlighted(false);
                    }
                    else if (cc.KEY["a"] == key)
                    {
                        self._leftBtnEx.setHighlighted(false);
                        self.onTouchLeftEvent();
                    }
                    else if (cc.KEY["d"] == key)
                    {
                        self._rightBtnEx.setHighlighted(false);
                        self.onTouchRightEvent();
                    }
                    else if (cc.KEY["l"] == key)
                    {
                        self.onTouchReturn(self._returnBtn, ccui.Widget.TOUCH_ENDED);
                    }
                    else if (cc.KEY["j"] == key)
                    {
                        //ShowMsgTips("UILevelEx onSelectLevel"+self._forLog);
                        //self._forLog = self._forLog + 111111111;
                        self.onSelectLevel();
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