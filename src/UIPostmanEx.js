/**
 * Created by qianmengxi on 15-6-12.
 */
var UIPostmanEx = cc.Node.extend({
    _pageView:null,
    _pageSize:null,
    _perPostmanSize:null,
    _uiEnterDelegate:null,
    _leftBtn:null,
    _rightBtn:null,
    _maxPageIdx:0,
    _maxHeroIdx:0,
    _levelNumPerPage:3,
    //适应键盘操作
    _curHeroIdx:0,
    _selectImg:null,
    _listener:null,
    ctor: function () {
        this._super();
    },
    init: function () {
        if (!this._super())
        {
            return false;
        }

        this._touchPanels = {};
        var baseNode = ParseUIFile("res/Postman.json");
        this.addChild(baseNode);

        this._closeBtn = ccui.helper.seekWidgetByName(baseNode, "Button_close");
        this._pageView = ccui.helper.seekWidgetByName(baseNode, "PageView_postman");
        this._leftBtn = ccui.helper.seekWidgetByName(baseNode, "Button_left");
        this._rightBtn = ccui.helper.seekWidgetByName(baseNode, "Button_right");
        this._leftBtn.setVisible(false);

        this._closeBtn.addTouchEventListener(this.onTouchCloseBtn, this);

        this._pageView.addEventListener(this.onPageViewEvent, this);
        this._pageSize = this._pageView.getContentSize();
        this._perPostmanSize = cc.size(this._pageSize.width/3, this._pageSize.height);

        //键盘操作
        var keyboardPanel = ccui.helper.seekWidgetByName(baseNode, "Panel_keyboard");
        keyboardPanel.setVisible(EnableKeyboard);

        this._leftBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_left1");
        this._rightBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_right1");
        this._upBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_up1");
        this._downBtnEx = ccui.helper.seekWidgetByName(baseNode, "Button_down1");
        this.initPageView();

        return true;
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    initButtonName: function () {
        var btnName = InitData.getStringByKey("back");
        AddNameToButton(btnName, this._returnBtn);

        var btnName = InitData.getStringByKey("next");
        AddNameToButton(btnName, this._nextBtn);
    },
    initPageView: function () {
        this._allPostman = InitData.getAllPostman();
        this._idx = 0;
        this._curPage = null;
        this.schedule(this.loadPostmanPerFrame, 0.1);
        /*
        //邮递员列表
        var allPostman = InitData.getAllPostman();
        var idx = 0;
        var page = null;
        for (var postmanName in allPostman)
        {
            if (idx % 3 == 0)
            {
                page = new ccui.Layout();
                page.setContentSize(this._pageSize);
            }

            var postman = this.createPostmanAndBg(postmanName, cc.p(this._perPostmanSize.width*(idx%3+0.5), this._perPostmanSize.height/2), idx);
            page.addChild(postman);

            if (idx % 3 == 0)
            {
                this._pageView.addPage(page);
                this._maxPageIdx ++;
            }

            idx ++;
            this._maxHeroIdx = idx - 1;
        }
        */

    },
    loadPostmanPerFrame: function (dt) {
        var postmanName = this.getPostmanNameByIdx(this._idx);
        if (postmanName == null)
        {
            this.unschedule(this.loadPostmanPerFrame);
            this.enableKeyboard();
            this.initSelectImg();
        }
        else
        {
            if (this._idx % 3 == 0)
            {
                this._curPage = new ccui.Layout();
                this._curPage.setContentSize(this._pageSize);
            }

            var postman = this.createPostmanAndBg(postmanName, cc.p(this._perPostmanSize.width*(this._idx%3+0.5), this._perPostmanSize.height/2), this._idx);
            this._curPage.addChild(postman);

            if (this._idx % 3 == 0)
            {
                this._pageView.addPage(this._curPage);
                this._maxPageIdx ++;
            }

            this._idx ++;
            this._maxHeroIdx = this._idx - 1;
        }
    },
    getPostmanNameByIdx: function (idx) {
        var retName = null;
        var curIdx = 0;
        for (var postmanName in this._allPostman)
        {
            if (curIdx == idx)
            {
                retName = postmanName;
                break;
            }
            else
            {
                curIdx ++;
            }
        }

        return retName;
    },
    setUIEnterDelegate: function (delegate) {
        this._uiEnterDelegate = delegate;
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
    createPostmanAndBg: function (postmanName, pos, heroIdx) {
        cc.log("postmanName:%s", postmanName);
        var postmanJson = InitData.getPostmanJson(postmanName);

        var baseNode = ParseUIFile("res/PostmanBg.json");
        baseNode.setPosition(pos);
        baseNode.setTag(heroIdx);
        baseNode.setName(postmanName);

        var basePanel = ccui.helper.seekWidgetByName(baseNode, "Panel_base");
        var touchPanel = ccui.helper.seekWidgetByName(basePanel, "Panel_touch");
        touchPanel.setName(postmanName);
        touchPanel.addTouchEventListener(this.onTouchPostman, this);
        this._touchPanels[postmanName] = touchPanel;

        var nameLabel = ccui.helper.seekWidgetByName(baseNode, "Text_name");
        var postmanImg = ccui.helper.seekWidgetByName(baseNode, "Image_postman");
        var priceText = ccui.helper.seekWidgetByName(baseNode, "Text_price");
        var lifeText = ccui.helper.seekWidgetByName(baseNode, "Text_life");
        var speedText = ccui.helper.seekWidgetByName(baseNode, "Text_speed");
        var jumpText = ccui.helper.seekWidgetByName(baseNode, "Text_jump");

        var lifeName = InitData.getStringByKey("life");
        lifeText.setString(lifeName);
        var speedName = InitData.getStringByKey("speed");
        speedText.setString(speedName);
        var jumpName = InitData.getStringByKey("jump");
        jumpText.setString(jumpName);
        priceText.setString(postmanJson["price"]);
        nameLabel.setString(postmanJson["name"]);
        postmanImg.loadTexture("Common/"+postmanJson["icon"], ccui.Widget.PLIST_TEXTURE);

        //星级
        for (var star = 1; star <= 5;star++)
        {
            var lifeStar = ccui.helper.seekWidgetByName(basePanel, "Image_life_star"+star);
            var runStar = ccui.helper.seekWidgetByName(basePanel, "Image_run_star"+star);
            var jumpStar = ccui.helper.seekWidgetByName(basePanel, "Image_jump_star"+star);
            if (star <= postmanJson["HP"])
            {
                lifeStar.setVisible(true);
            }
            else
            {
                lifeStar.setVisible(false);
            }

            if (star <= postmanJson["SP"])
            {
                runStar.setVisible(true);
            }
            else
            {
                runStar.setVisible(false);
            }

            if (star <= postmanJson["JP"])
            {
                jumpStar.setVisible(true);
            }
            else
            {
                jumpStar.setVisible(false);
            }
        }

        //加锁
        var bEnable = GameStorage.isHeroEnable(postmanName);
        if (!bEnable)
        {
            var lockImg = new ccui.ImageView("Common/_0040.png", ccui.Widget.PLIST_TEXTURE);
            var panelSize = touchPanel.getContentSize();
            lockImg.setPosition(cc.p(panelSize.width/2, panelSize.height/2));
            lockImg.setScale(0.5);
            lockImg.setTouchEnabled(false);
            touchPanel.addChild(lockImg);
        }

        return baseNode;
    },
    onTouchPostman: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            //选择快递员
            var postmanName = sender.getName();
            cc.log("postmanName:%d", postmanName);
            this.onSelectPostman(sender, postmanName);
        }
    },
    onSelectPostman: function (heroImg, postmanName) {
        var bEnable = GameStorage.isHeroEnable(postmanName);
        if (!bEnable)
        {
            var postmanJson = InitData.getPostmanJson(postmanName);
            var price = postmanJson["price"];
            if (price <= GlobalGold)
            {
                this.disableKeyboard();

                var content = "";
                if (IsChinese)
                {
                    content = "是否花费" + price + "金币购买快递员？";
                }
                else
                {
                    content = "Will you cost " + price + " coin to buy the new avata？";
                }
                var msgBox = new MsgBox();
                msgBox.setContent(content);
                msgBox.setCloseEventListener(this, this.showPostmanUI);
                msgBox.setConfrimEventListener(this, this.onBuyPostmanSuccess, heroImg, postmanName);
                cc.director.getRunningScene().addChild(msgBox);
                this.setVisible(false);
            }
            else
            {
                if (IsChinese)
                {
                    ShowMsgTips(NeedGoldCh);
                }
                else
                {
                    ShowMsgTips(NeedGoldEn);
                }
            }
        }
        else
        {
            this.onTouchPostmanEvent(postmanName);
        }
    },
    onTouchPostmanEvent: function (postmanName) {
        GameStorage.setDefaultPostmanName(postmanName);

        //播放声音，播放新快递员骨骼动画
        if (this._uiEnterDelegate)
        {
            SoundManager.playSelectPostmanEffect();
            this._uiEnterDelegate.refreshPostmanAnimation();
        }

        if (this._uiEnterDelegate)
        {
            this._uiEnterDelegate.enableKeyboardTouch();
        }
        this.removeFromParent(true);
    },
    onTouchCloseBtn: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {
            SoundManager.playButtonEffect();

            if (this._uiEnterDelegate)
            {
                this._uiEnterDelegate.enableKeyboardTouch();
            }
            this.removeFromParent(true);
        }
    },
    onBuyPostmanSuccess: function (postmanImg, postmanName) {
        this.enableKeyboard();
        //扣除金币
        var postmanJson = InitData.getPostmanJson(postmanName);
        var price = postmanJson["price"];
        GlobalGold = GlobalGold - price
        GameStorage.setUserGold(GlobalGold);

        //购买成功
        this.setVisible(true);
        postmanImg.removeAllChildren();
        GameStorage.enableHero(postmanName);
    },
    showPostmanUI: function () {
        this.enableKeyboard();
        this.setVisible(true);
    },
    initSelectImg: function () {
        var pageIdx = Math.floor(this._curHeroIdx / this._levelNumPerPage);
        var page = this._pageView.getPage(pageIdx);
        var heroNode = page.getChildByTag(this._curHeroIdx);
        if (heroNode)
        {
            this.addSelectImg(heroNode);
        }
    },
    addSelectImg: function (parent) {
        if (this._selectImg) this._selectImg.removeFromParent();
        this._selectImg = new ccui.ImageView("Common/_0113.png", ccui.Widget.PLIST_TEXTURE);
        this._selectImg.ignoreContentAdaptWithSize(false);
        this._selectImg.setContentSize(cc.size(210, 400));
        this._selectImg.setAnchorPoint(0.5, 0.5);
        parent.addChild(this._selectImg);
    },
    onTouchLeftEvent: function () {
        if (this._curHeroIdx > 0)
        {
            this._curHeroIdx --;
            var pageIdx = Math.floor(this._curHeroIdx / this._levelNumPerPage);
            var curPageIdx = this._pageView.getCurPageIndex();
            if (pageIdx < curPageIdx)
            {
                this._pageView.scrollToPage(pageIdx);
            }

            var page = this._pageView.getPage(pageIdx);
            if (page)
            {
                var heroNode = page.getChildByTag(this._curHeroIdx);
                if (heroNode) {
                    this.addSelectImg(heroNode);
                }
            }
        }
    },
    onTouchRightEvent: function () {
        if (this._maxHeroIdx > this._curHeroIdx)
        {
            this._curHeroIdx ++;
            var pageIdx = Math.floor(this._curHeroIdx / this._levelNumPerPage);
            var curPageIdx = this._pageView.getCurPageIndex();
            if (pageIdx > curPageIdx)
            {
                this._pageView.scrollToPage(pageIdx);
            }

            var page = this._pageView.getPage(pageIdx);
            if (page)
            {
                var heroNode = page.getChildByTag(this._curHeroIdx);
                if (heroNode)
                {
                    this.addSelectImg(heroNode);
                }
            }
        }
    },
    onSelectHero: function () {
        var pageIdx = Math.floor(this._curHeroIdx / this._levelNumPerPage);
        var page = this._pageView.getPage(pageIdx);
        if (page)
        {
            var heroNode = page.getChildByTag(this._curHeroIdx);
            if (heroNode)
            {
                var heroName = heroNode.getName();
                var touchPanel = this._touchPanels[heroName];
                this.onSelectPostman(touchPanel, heroName);
            }
        }
    },
    initKeyboardTouch: function () {
        var self = this;
        if ('keyboard' in cc.sys.capabilities) {
            self._listener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    switch (key) {
                        case cc.KEY["w"]:
                            self._upBtnEx.setHighlighted(true);
                            break;

                        case cc.KEY["s"]:
                            self._downBtnEx.setHighlighted(true);
                            break;

                        case cc.KEY["a"]:
                        {
                            self._leftBtnEx.setHighlighted(true);
                            break;
                        }
                        case cc.KEY["d"]:
                        {
                            self._rightBtnEx.setHighlighted(true);
                            break;
                        }
                        default :
                            break;
                    }
                },
                onKeyReleased: function (key, event) {
                    switch (key) {
                        case cc.KEY["w"]:
                            self._upBtnEx.setHighlighted(false);
                            break;

                        case cc.KEY["s"]:
                            self._downBtnEx.setHighlighted(false);
                            break;

                        case cc.KEY["a"]:
                        {
                            self._leftBtnEx.setHighlighted(false);
                            self.onTouchLeftEvent();
                            break;
                        }
                        case cc.KEY["d"]:
                        {
                            self._rightBtnEx.setHighlighted(false);
                            self.onTouchRightEvent();
                            break;
                        }
                        case cc.KEY["l"]:
                            self.onTouchCloseBtn(self._closeBtn, ccui.Widget.TOUCH_ENDED);
                            break;

                        case cc.KEY["j"]:
                            self.onSelectHero();
                            break;

                        default :
                            break;
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
    },
    enableKeyboard: function () {
        if (this._listener == null)
        {
            this.initKeyboardTouch();
        }
    }
})