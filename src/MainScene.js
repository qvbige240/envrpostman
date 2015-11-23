/**
 * Created by qianmengxi on 15-6-1.
 */
var MainLayer = cc.Layer.extend({
    _moveSpeed:0,//移动速度,pix/frame
    _speedRate:1,//速度倍率
    _topTreeNode:null,//道路上侧树的父结点
    _bottomTreeNode:null,//道路下侧树的父结点
    _road1:null,//
    _road2:null,//road1和road2循环播放
    _roadLength:0.0,
    _monsterNode:null,//怪物父结点,
    _postman:null,
    _postmanRoadIdx:0,//快递员当前所在车道位
    _isPause:false,//是否暂停
    _isStop:false,//是否结束
    _isJumping:false,//快递员跳跃中...
    _speedupAnimation:null,//场景加速动画
    _newRecordAnimation:null,//新纪录动画
    _reviveAnimation:null,//复活动画
    _nextLevelAnimation:null,//下一关开启动画
    _totalLength:0,//关卡总距离
    _passedLength:0,//已通过距离
    _lastPassedLength:0,//上次通过距离
    _uiMain:null,
    _levelName:"",
    _syncNum:0,//每次怪物同时出现的最大数量
    _prob:0,//每个怪物出现的概率
    _barrierProb:0,//每个障碍物出现的概率
    _trick1Prob:0,//特殊障碍物1出现的概率
    _trick2Prob:0,//特殊障碍物2出现的概率
    _trick3Prob:0,//特殊障碍物3出现的概率
    _goldProb:0,//每个金币出现的概率
    _accProb:0,//每个加速器出现的概率
    _frameCount:0,
    _timer:0,//计时器
    _speedupEndTime:0,
    _invicibleEndTime:0,
    _success:false,
    _flagEnermy:null,//导致邮递员死亡的怪物或障碍物
    _curPostmanLife:0,//当前生命值
    _reviveEnable:true,//原地复活是否可用
    _levelMode:0,//关卡模式，无尽和普通
    _nextLevelName:"",
    _dropLifeAnimation:null,
    ctor: function (levelName) {
        this._super();
        this._levelName = levelName;
    },
    init: function () {
        if (!this._super())
        {
            return false;
        }

        //ui层
        this._uiMain = new UIMain(this._levelName);
        this._uiMain.init();
        this.addChild(this._uiMain);

        this._uiMain.addMoveEventCallFunc(this, this.onMoveEvent);
        this._uiMain.addJumpEventCallFunc(this, this.onJumpEvent);
        this._uiMain.addPauseEventCallFunc(this, this.onPauseEvent);

        //树的父结点
        this._topTreeNode = this._uiMain.getTopTreeNode();
        this._bottomTreeNode = this._uiMain.getBottomTreeNode();

        //道路
        this._road1 = this._uiMain.getRoad1Img();
        this._road2 = this._uiMain.getRoad2Img();
        this._roadLength = this._road1.getContentSize().width;

        //怪物父结点
        this._monsterNode = this._uiMain.getMonsterNode();

        //加入邮递员
        this._postman = new Postman(GameStorage.getDefaultPostmanName());
        this._postman.init();
        this.initPostman();
        this._monsterNode.addChild(this._postman);
        this._moveSpeed = this._postman.getSpeed();
        cc.log("moveSpeed:%d", this._moveSpeed);

        //初始化配置数据
        var levelJson = InitData.getLevelJson(this._levelName);
        this._syncNum = levelJson["sync"];
        this._prob = levelJson["prob"];
        this._barrierProb = levelJson["barrier_prob"];
        this._trick1Prob = levelJson["Trick1"];
        this._trick2Prob = levelJson["Trick2"];
        this._trick3Prob = levelJson["Trick3"];
        this._goldProb = levelJson["gold_prob"];
        this._accProb = levelJson["acc_prob"];
        this._levelMode = levelJson["mod"];
        this._nextLevelName = levelJson["next_level"];

        if (this._levelMode == LevelMode.normal)
        {
            //关卡长度
            this._totalLength = this._moveSpeed * 60 * levelJson["distance"];
        }
        else
        {
            this._totalLength = this._moveSpeed * 60 * 3600;
        }


        //播放BGM
        SoundManager.playLevelBGM(this._levelName);

        //树木初始化
        this.initTrees();
        this.initLastPassedLength();
        this.schedule(this.timerFunc, 0.1);
        this.initPostmanLife();
        return true;
    },
    initPostmanLife: function () {
        var postmanJson = InitData.getPostmanJson(GameStorage.getDefaultPostmanName());
        this._curPostmanLife = postmanJson["HP"];
        cc.log("postmanLife:%d", this._curPostmanLife);
        this._uiMain.setLifeImg(this._curPostmanLife);
    },
    initPostman: function () {
        this._postmanRoadIdx = 1;//初始车道为1
        this._postman.setPosition(PostmanInitPosX, RoadPosY[this._postmanRoadIdx]);
        this._postman.setLocalZOrder(ZOrderOnRoad[this._postmanRoadIdx]);
        this._postman.setTag(PostmanTag);
        this._postman.playWalk();
    },
    initTrees: function () {
        this._topTreeNode.removeAllChildren();
        this._bottomTreeNode.removeAllChildren();

        var treeNum = GameRandomInt(4, 6);
        for (var i = 0; i<treeNum; i++)
        {
            var posX = ScreenWidth/treeNum*(i+1);
            var isTop = GameRandomInt(0, 1);
            var tree = this.createRandomTree();
            if (isTop)
            {
                tree.setPosition(posX, TopTreePosY);
                this._topTreeNode.addChild(tree);
            }
            else
            {
                tree.setPosition(posX, BottomTreePosY);
                this._bottomTreeNode.addChild(tree);
            }
        }
    },
    start: function () {
        this._uiMain.enableKeyboard();

        //开始移动动作
        this._postman.playWalk();

        //生成树和怪物
        this.startCreateTreeAndMonster(true);

        this.scheduleUpdate();
    },
    initLastPassedLength: function () {
        if (this._levelMode == LevelMode.normal)
        {
            //最高记录tag
            var isLevelClear = GameStorage.isLevelClear(this._levelName);
            if (!isLevelClear)
            {
                this._lastPassedLength = GameStorage.getLevelPassedLength(this._levelName);
                cc.log("lastPassedLength:%d", this._lastPassedLength);
                if (this._lastPassedLength != undefined && this._lastPassedLength > 0)
                {
                    var lastPercent = this._lastPassedLength / this._totalLength;
                    this._uiMain.setLastTagPercentPositionX(lastPercent);
                    this._uiMain.setLastTagVisible(true);
                }
                else
                {
                    //没记录不显示
                    this._uiMain.setLastTagVisible(false);
                }
            }
            else
            {
                //通关后不显示
                this._uiMain.setLastTagVisible(false);
            }
        }
        else
        {
            //无尽模式不显示
            this._uiMain.setLastTagVisible(false);
            this._uiMain.setCurTagVisible(false);
            this._uiMain.setNextTagVisible(false);
        }

    },
    timerFunc: function (dt) {
        if (!this._isPause && !this._isStop)
        {
            this._timer += 0.1;
            if (Math.floor(this._speedupEndTime*10) == Math.floor(this._timer*10))
            {
                this.cancleSpeedUp();
            }

            if (Math.floor(this._invicibleEndTime*10) == Math.floor(this._timer*10))
            {
                this.cancleInvicibleState();
            }
        }
    },
    //重新开始
    reset: function () {
        this._uiMain.enableKeyboard();
        this._uiMain.setRecordImgVisible(false);
        this.unschedule(this.addDeadSubTitle);
        this._postman.setDead(false);
        this.initPostman();
        this.initLastPassedLength();
        this.initTrees();
        this.initPostmanLife();

        this.removeAllMonster();
        this.removeNewRecordAnimation();
        this._speedRate = 1;
        this._isPause = false;
        this._isStop = false;
        this._isJumping = false;
        this._passedLength = 0;
        this._success = false;
        this._reviveEnable = true;

        if (this._flagEnermy)
        {
            this._flagEnermy.removeFromParent();
            this._flagEnermy = null;
        }
    },
    //复活
    revive: function () {
        this.unschedule(this.addDeadSubTitle);
        this.playReviveAnimation();
        this.initPostmanLife();
    },
    reviveCallBack: function () {
        this.removeAllMonster();
        if (this._flagEnermy)
        {
            this.KickOutEnermy(this._flagEnermy);
            this._flagEnermy = null;
        }

        this._uiMain.setRecordImgVisible(false);
        this._postman.setDead(false);
        this._postman.playWalk();
        //this.removeNewRecordAnimation();
        this._speedRate = 1;
        this._isPause = false;
        this._isStop = false;
        this._isJumping = false;
        this._success = false;
        this._reviveEnable = false;

        this.start();
    },
    removeAllMonster: function () {
        var enermys = this._monsterNode.getChildren();
        for (var i in enermys)
        {
            //忽略快递员
            if (enermys[i].getTag() == PostmanTag)
            {
                continue;
            }

            //flagEnermy由快递员击飞
            if (enermys[i] == this._flagEnermy)
            {
                continue;
            }

            enermys[i].removeFromParent();
        }
    },
    getMoveSpeed: function () {
        return this._moveSpeed * this._speedRate;
    },
    getMonsterMoveSpeed: function (monster) {
        return monster.getMoveSpeed() * this._speedRate;
    },
    isSpeedUpMode: function () {
        return (this._speedRate > 1.0);
    },
    onEnter: function () {
        this._super();
    },
    update:function(dt){
        this.moveRoad();
        this.moveTree();
        this.moveMonster();
        this.countPassedLength();
        this._frameCount ++;
        if (this._frameCount%10 == 0)
        {
            this._uiMain.setCurDistance(Math.ceil(this._passedLength/100));
        }
    },
    countPassedLength: function () {
        if (!this._isStop)
        {
            this._passedLength = this._passedLength + this.getMoveSpeed();

            //无尽模式，开启下一关
            if (this._levelMode == LevelMode.endless)
            {
                if (this._passedLength > this._moveSpeed * 60 * 300)
                {
                    //通关,下一关开启
                    GameStorage.setLevelClear(this._levelName);
                    GameStorage.openLevel(this._nextLevelName);
                    this.playNextLevelAniamtion();
                }

                return;
            }

            //普通模式
            var percent = this._passedLength/this._totalLength;
            this._uiMain.setNowTagPercentPositionX(percent);
            this._uiMain.setCloudPercentPositionX(percent);

            var postmanPosX = this._postman.getPositionX();
            if (this._lastPassedLength > 0 && this._passedLength + ScreenWidth - postmanPosX + 50 > this._lastPassedLength)
            {
                var recordRoadTagPosX = postmanPosX + this._lastPassedLength - this._passedLength;
                //cc.log("recordRoadTagPosx:%f, %f, %f", recordRoadTagPosX, postmanPosX, this._lastPassedLength);
                //最高记录标识
                this._uiMain.setRecordImgPositionX(recordRoadTagPosX);
            }

            if (this._passedLength + ScreenWidth - postmanPosX + 50 > this._totalLength)
            {
                //终点标识
                var endTagPosX = postmanPosX + this._totalLength - this._passedLength;
                this._uiMain.setEndImgPositionX(endTagPosX);
            }

            //播放通过最高纪录动画,声音
            if (this._lastPassedLength > 0 && this._newRecordAnimation == null && this._passedLength > this._lastPassedLength)
            {
                this.playNewRecordAnimation();
                SoundManager.playRecordEffect();
            }

            //通过终点
            if (this._passedLength > this._totalLength)
            {
                this.stopGame();
                this.onSuccess();
            }
        }
    },
    createRandomTree: function () {
        //配置表中读取
        var levelJson = InitData.getLevelJson(this._levelName);
        var trees = levelJson["trees"];
        var r = GameRandomInt(0, trees.length-1);
        var tree = new Tree(trees[r]);
        return tree;
    },
    createRandomMonster: function () {
        //配置表中读取
        var levelJson = InitData.getLevelJson(this._levelName);
        var monsterArr = levelJson["monsters"];
        var idx = GameRandomInt(0, monsterArr.length-1);
        return new Monster(monsterArr[idx]);
    },
    createBarrier: function () {
        var r = GameRandomInt(MinBarrierTypeID, MaxBarrierTypeID);
        return new Barrier(r);
    },
    addMonster: function (dt) {
        if (!this._isStop)
        {
            //cc.log("addMonster %d", this._forTest);
            //可能同时出现怪物的最大数量
            var synMonster = this._syncNum;
            var prob = this._prob;
            var roadArr = new Array(0, 1, 2, 3);
            while (synMonster > 0) {
                //概率出现怪物
                var r = GameRandomInt(1, 100);
                if (r <= prob) {
                    //随机位置
                    var idx = GameRandomInt(0, roadArr.length - 1);
                    var roadIdx = roadArr[idx];
                    roadArr.splice(idx, 1);

                    //随机怪物类型
                    var monster = this.createRandomMonster();
                    this._monsterNode.addChild(monster);

                    monster.setLocalZOrder(ZOrderOnRoad[roadIdx]);
                    monster.setPosition(RoadPosX + 50, RoadPosY[roadIdx]);
                    monster.playWalk();
                }
                synMonster--;
            }
        }
    },
    addOppositeMonster: function () {
        if (!this._isStop)
        {
            var roadIdx = GameRandomInt(0, MaxRoadIdx - 1);
            this.playAddMonsterAnimation(roadIdx);
        }
    },
    addBarrier: function () {
        //cc.log("addBarrier %d", this._forTest);
        if (!this._isStop)
        {
            //概率出现
            var r = GameRandomInt(1, 100);
            if (r <= this._barrierProb)
            {
                //随机跑道位置
                var roadIdx = GameRandomInt(0, MaxRoadIdx - 1);

                var barrier = this.createBarrier();
                this._monsterNode.addChild(barrier);

                barrier.setLocalZOrder(ZOrderOnRoad[roadIdx]-1);
                barrier.setPosition(RoadPosX, RoadPosY[roadIdx]);
            }
            else if (r <= this._barrierProb + this._trick1Prob)
            {
                this.addDropBarrier();
            }
            else if (r <= this._barrierProb + this._trick1Prob + this._trick2Prob)
            {
                this.addThornBarrier();
            }
            else if (r <= this._barrierProb + this._trick1Prob + this._trick2Prob + this._trick3Prob)
            {
                this.addOppositeMonster();
            }
        }
    },
    //天上落下障碍物
    addDropBarrier: function () {
        if (!this._isStop)
        {
            //随机跑道位置
            var roadIdx = GameRandomInt(0, MaxRoadIdx - 1);

            var barrier = new DropBarrier();
            barrier.removeFromRoad();
            barrier.playDropAnimation();
            this._monsterNode.addChild(barrier);

            barrier.setLocalZOrder(ZOrderOnRoad[roadIdx]-1);
            barrier.setPosition(1000, RoadPosY[roadIdx]);
        }
    },
    //荆棘障碍物
    addThornBarrier: function () {
        if (!this._isStop)
        {
            //随机跑道位置
            var roadIdx = GameRandomInt(0, MaxRoadIdx - 1);

            var barrier = new ThornBarrier();
            this._monsterNode.addChild(barrier);

            barrier.setLocalZOrder(ZOrderOnRoad[roadIdx]-1);
            barrier.setPosition(ScreenWidth + 420, RoadPosY[roadIdx]);
        }
    },
    addItem: function () {
        //cc.log("addItem %d", this._forTest);
        if (!this._isStop)
        {
            var r = GameRandomInt(1, 100);
            //cc.log("item random %d, %d", r, this._accProb);
            //随机跑道位置
            var roadIdx = GameRandomInt(0, MaxRoadIdx - 1);
            if (r <= this._accProb) {
                var accelerator = new ItemAccelerator();
                accelerator.init();
                accelerator.playNormalAction();
                this._monsterNode.addChild(accelerator);

                accelerator.setLocalZOrder(ZOrderOnRoad[roadIdx]);
                accelerator.setPosition(RoadPosX, RoadPosY[roadIdx]);

            }
            else if (r > this._accProb && r <= this._goldProb + this._accProb) {
                var gold = new ItemGold();
                gold.init();
                gold.playNormalAction();
                this._monsterNode.addChild(gold);

                gold.setLocalZOrder(ZOrderOnRoad[roadIdx]);
                gold.setPosition(RoadPosX, RoadPosY[roadIdx]);
            }
        }
    },
    addTree: function (dt) {
        //cc.log("addTree %d", this._forTest);
        if (!this._isStop)
        {
            //概率
            var r = GameRandomInt(1, 100);
            if (r <= 70)
            {
                var isTop = GameRandomInt(0, 1);
                var tree = this.createRandomTree();
                if (isTop)
                {
                    tree.setPosition(TreePosX, TopTreePosY);
                    this._topTreeNode.addChild(tree);
                }
                else
                {
                    tree.setPosition(TreePosX, BottomTreePosY);
                    this._bottomTreeNode.addChild(tree);
                }
            }
        }
    },
    //弹幕
    addSubTitle: function (dt) {
        if (this.isSubtitleOpen())
        {
            this.showSubTitle(SubTitleType.runing, 30);
        }
    },
    addDeadSubTitle: function (dt) {
        if (this.isSubtitleOpen()) {
            this.showSubTitle(SubTitleType.dead);
        }
    },
    moveTree: function () {
        if (!this._isStop)
        {
            //道路上侧树木
            var allTopTrees = this._topTreeNode.getChildren();
            for (var i in allTopTrees) {
                var posX = allTopTrees[i].getPositionX();
                //如果移动至界外，删除
                if (posX < LeftBoundaryPosX) {
                    allTopTrees[i].removeFromParent(true);
                    continue;
                }

                //每一帧移动moveSpeed个像素
                allTopTrees[i].setPositionX(posX - this.getMoveSpeed());
            }

            //道路下侧树木
            var allBottomTrees = this._bottomTreeNode.getChildren();
            for (var i in allBottomTrees) {
                var posX = allBottomTrees[i].getPositionX();
                //如果移动至界外，删除
                if (posX < LeftBoundaryPosX) {
                    allBottomTrees[i].removeFromParent(true);
                    continue;
                }

                //每一帧移动moveSpeed个像素
                allBottomTrees[i].setPositionX(posX - this.getMoveSpeed());
            }
        }
    },
    moveRoad: function () {
        if (!this._isStop)
        {
            var road1PosX = this._road1.getPositionX() - this.getMoveSpeed();
            var road2PosX = this._road2.getPositionX() - this.getMoveSpeed();
            if (road1PosX <= -this._roadLength)
            {
                road1PosX += this._roadLength * 2;
            }

            if (road2PosX <= -this._roadLength)
            {
                road2PosX += this._roadLength * 2;
            }

            this._road1.setPositionX(road1PosX);
            this._road2.setPositionX(road2PosX);
        }
    },
    moveMonster: function () {
        var enermys = this._monsterNode.getChildren();
        for (var i in enermys)
        {
            //忽略快递员
            if (enermys[i].getTag() == PostmanTag)
            {
                if (this._success)
                {
                    //结束后向前走
                    enermys[i].setPositionX(enermys[i].getPositionX() + this.getMoveSpeed());
                }
                continue;
            }

            //怪物停止移动
            if (enermys[i].getType() == ItemType.monster && enermys[i].isStopWalk())
            {
                continue;
            }

            //障碍物停止移动
            if (enermys[i].getType() == ItemType.barrier && (this._isStop || enermys[i].hasRemovedFromRoad()))
            {
                continue;
            }

            //道具不移动
            if ((enermys[i].getType() == ItemType.gold || enermys[i].getType() == ItemType.accelerator) && this._isStop)
            {
                continue;
            }

            //是否超出屏幕范围
            var posX = enermys[i].getPositionX();
            if (posX < LeftBoundaryPosX || posX > RightBoundaryPosX)
            {
                enermys[i].removeFromParent(true);
                continue;
            }

            //和邮递员的碰撞检测
            if (!this._isStop && this.checkCollision(enermys[i]))
            {
                this.onCollision(enermys[i]);
                continue;
            }

            //移动速度
            var moveSpeed = 0;
            if (enermys[i].getType() == ItemType.monster)
            {
                //迎面来的怪物
                if (enermys[i].getScaleX() == -1)
                {
                    if (this._isStop)
                    {
                        //结束后
                        moveSpeed = -this.getMonsterMoveSpeed(enermys[i]);
                    }
                    else
                    {
                        //未结束
                        moveSpeed = this.getMonsterMoveSpeed(enermys[i]) + this.getMoveSpeed();
                    }
                }
                //和快递员相同方向的怪物
                else
                {
                    moveSpeed = this.getMonsterMoveSpeed(enermys[i]);
                }
            }
            else
            {
                moveSpeed = this.getMoveSpeed();
            }

            //处理怪物和障碍物坐标
            if (this._isStop)
            {
                //结束后向前走
                enermys[i].setPositionX(posX + moveSpeed);
            }
            else
            {
                //未结束向后走
                enermys[i].setPositionX(posX - moveSpeed);
            }
        }
    },
    onMoveEvent: function (self, direction) {
        if (!this._isStop)
        {
            //cc.log("moveDirection:%d, postmanRoadIdx:%d", direction, self._postmanRoadIdx);
            if (self._postmanRoadIdx < MaxRoadIdx && self._postmanRoadIdx >= 0)
            {
                if (direction == MoveDirection.up)
                {
                    if ((self._postmanRoadIdx + 1) < MaxRoadIdx)
                    {
                        //播放变道音效
                        SoundManager.playSwitchRoadEffect();

                        self._postmanRoadIdx ++;

                        self._postman.stopActionByTag(10);
                        var moveTo = cc.moveTo(0.3, cc.p(PostmanInitPosX, RoadPosY[self._postmanRoadIdx]));
                        moveTo.setTag(10);
                        self._postman.runAction(moveTo);
                        self._postman.setLocalZOrder(ZOrderOnRoad[self._postmanRoadIdx]);
                    }
                }
                else
                {
                    if ((self._postmanRoadIdx - 1) >= 0)
                    {
                        //if (!self._postman.isMoving())
                        {
                            //播放变道音效
                            SoundManager.playSwitchRoadEffect();

                            self._postmanRoadIdx--;

                            /*
                            self._postman.startMove();
                            var moveTo = cc.moveTo(0.3, cc.p(PostmanInitPosX, RoadPosY[self._postmanRoadIdx]));
                            var callBack = cc.callFunc(function (sender, value) {
                                sender.stopMove();
                            });
                            self._postman.runAction(cc.sequence(moveTo, callBack));
                            */

                            self._postman.stopActionByTag(10);
                            var moveTo = cc.moveTo(0.3, cc.p(PostmanInitPosX, RoadPosY[self._postmanRoadIdx]));
                            moveTo.setTag(10);
                            self._postman.runAction(moveTo);
                            self._postman.setLocalZOrder(ZOrderOnRoad[self._postmanRoadIdx]);
                        }
                    }
                }
            }
        }
    },
    onJumpEvent: function (self) {
        if (!self._isStop && !self._isJumping)
        {
            //播放起跳音效
            SoundManager.playJumpEffect();

            self._isJumping = true;
            self._postman.playJump(function () {
                if (!self._postman.isDead())
                {
                    self._isJumping = false;
                    //播放跳跃完成音效
                    SoundManager.playJumpFinishEffect();
                }
            });

            if (self.isSpeedUpMode())
            {
                self._postman.addRun();
            }
            else
            {
                self._postman.addWalk();
            }
        }
    },
    onPauseEvent: function (self) {
        self.delaySetGold();
        self.pauseGame();

        //暂停界面
        var uiPause = new UIPause();
        uiPause.init();
        uiPause.setMainLayerDelegate(self);
        self.addChild(uiPause);
    },
    pauseGame: function () {
        //暂停所有怪物，邮递员，道路，树木，障碍物，背景的移动
        this._isPause = true;
        this.pause();
        this._postman.pauseAction();
        this.pauseAllMonsterAnimation();
    },
    resumeGame: function () {
        this._isPause = false;
        this.resume();
        this._postman.resumeAction();
        this.resumeAllMonsterAnimation();

        //开启战斗界面的键盘操作
        this._uiMain.initKeyboardTouch();
    },
    //弹幕开关
    closeSubtitle: function () {
        GlobalCommentSwitch = false;
    },
    openSubtitle: function () {
        GlobalCommentSwitch = true;
    },
    isSubtitleOpen: function () {
        return GlobalCommentSwitch;
    },
    checkCollision: function (enermy) {
        var posX = enermy.getPositionX();
        var posY = enermy.getPositionY();
        var postmanPosX = this._postman.getPositionX();
        var postmanHalfWidth = this._postman.getHalfWidth();
        var roadPosY = RoadPosY[this._postmanRoadIdx];
        if (enermy.getType() == ItemType.monster)
        {
            /*怪物碰撞处理*/

            var monsterHalfWidth = enermy.getHalfWidth();
            //碰撞检测
            //y轴距离
            if (Math.abs(posY - roadPosY) < 5.0)
            {
                //x轴距离
                if ((posX >= postmanPosX && posX - postmanPosX < (postmanHalfWidth + monsterHalfWidth))
                || (posX < postmanPosX && postmanPosX - posX < postmanHalfWidth))
                {
                    return true;
                }
            }
        }
        else if (enermy.getType() == ItemType.barrier)
        {
            /*障碍物碰撞处理*/

            var postmanPosY = this._postman.getPositionY();
            var halfWidth = enermy.getHalfWidth();
            //碰撞检测
            //y轴距离
            if (!this._isJumping && Math.abs(posY - roadPosY) < 5.0)
            {
                //x轴距离
                if ((posX >= postmanPosX && posX - postmanPosX < (postmanHalfWidth + halfWidth))
                    || (posX < postmanPosX && postmanPosX - posX < postmanHalfWidth))
                {
                    return true;
                }
            }
        }
        else
        {
            /*金币和加速道具*/

            var postmanPosY = this._postman.getPositionY();
            var halfWidth = enermy.getHalfWidth();
            //碰撞检测
            if (enermy.isItemEnable()
                && !this._isJumping
                //Math.abs(posY - postmanPosY) < 5.0
                && Math.abs(posY - roadPosY) < 5.0
                && Math.abs(posX - postmanPosX) < postmanHalfWidth + halfWidth)
            {
                return true;
            }
        }

        return false;
    },
    onCollision: function (enermy) {
        //是否无敌状态
        if (this._postman.isInvicible())
        {
            //怪物停止移动
            if (enermy.getType() == ItemType.monster)
            {
                enermy.stopWalk();
            }

            if (enermy.getType() == ItemType.monster
                || enermy.getType() == ItemType.barrier)
            {
                this.KickOutEnermy(enermy);
            }
        }
        else
        {
            //关卡失败
            if (enermy.getType() == ItemType.monster
                || enermy.getType() == ItemType.barrier)
            {
                this.onCollisionMonsterOrBarrier(enermy);
            }
        }

        //吃道具
        if (enermy.getType() == ItemType.gold)
        {
            //var time1 = Date.now();
            SoundManager.playGetGoldEffect();
            this.delayAddGold();
            //var time2 = Date.now();
            enermy.playDisappearAction();
            //var time3 = Date.now();
            enermy.setItemEnable(false);
            //var time4 = Date.now();

            if (this.isSubtitleOpen())
            {
                //弹幕
                this.showSubTitle(SubTitleType.gold, 50);
            }
            /*
            var time5 = Date.now();
            cc.log("time1:%d", time2 - time1);
            cc.log("time2:%d", time3 - time2);
            cc.log("time3:%d", time4 - time3);
            cc.log("time4:%d", time5 - time4);
            */
        }
        else if (enermy.getType() == ItemType.accelerator)
        {
            if (this.isSubtitleOpen())
            {
                //弹幕
                this.showSubTitle(SubTitleType.speedup, 50);
            }

            this.speedUp();
            enermy.playSpeedupAction();
            enermy.setItemEnable(false);
        }
    },
    delayAddGold: function () {
        GlobalGold += 1;
        var delay = cc.DelayTime(0.2);
        var callFunc = cc.callFunc(function (self) {
            self._uiMain.refreshGoldText(0);
        });
        this.runAction(cc.sequence(delay, callFunc));
    },
    onCollisionMonsterOrBarrier: function (enermy) {
        //掉血
        this._curPostmanLife --;
        this.playDropLifeAnimation();
        this._uiMain.setLifeImg(this._curPostmanLife);
        if (this._curPostmanLife <= 0)
        {
            this.stopGame();
            //检测是怪物还是障碍物
            if (enermy.getType() == ItemType.monster)
            {
                this._postman.setDead(true);
                this._postman.playDie1();

                enermy.stopWalk();
                enermy.playAgainst();

                //对准快递员方向
                if (enermy.getPositionX() > this._postman.getPositionX())
                {
                    enermy.setScaleX(-1);
                }

                this._flagEnermy = enermy;
            }
            else if (enermy.getType() == ItemType.barrier)
            {
                this._postman.setDead(true);
                this._postman.playDie2();

                this._flagEnermy = enermy;
            }

            //失败或胜利后的逻辑处理
            this.checkResult();
        }
        else
        {
            this._postman.runBlinkAction();
            this._postman.setInvicible(true);
            //无敌结束时间
            this._invicibleEndTime = this._timer + 3.0;
        }
    },
    KickOutEnermy: function (enermy) {
        SoundManager.playCollisionEffect();

        var moveBy = cc.moveBy(0.3, cc.p(300, 720));
        var rotate = cc.rotateBy(0.3, 360);
        var spawn = cc.spawn(moveBy, rotate);
        var callFunc = cc.callFunc(function (sender, value) {
            sender.removeFromParent(true);
        });
        enermy.runAction(cc.sequence(spawn, callFunc));
        //怪物和障碍物的停止移动
        if (enermy.getType() == ItemType.monster)
        {
            enermy.stopWalk();
        }
        else if (enermy.getType() == ItemType.barrier)
        {
            enermy.removeFromRoad();
        }
    },
    speedUp: function () {
        //播放加速声音
        SoundManager.playSpeedUpEffect();

        //加速模式
        this.startCreateTreeAndMonster(false);
        this._postman.setInvicible(true);
        this._postman.playRun();
        this._speedRate = 2.0;
        this.playSpeedUpAnimation();

        //加速结束时间
        this._speedupEndTime = this._timer + SpeedUpTime;
        //无敌结束时间
        this._invicibleEndTime = this._timer + InvincibleTime;
    },
    cancleSpeedUp: function () {
        //取消加速
        this._speedRate = 1.0;
        this.startCreateTreeAndMonster(true);
        this._postman.playWalk();
        this.cancleSpeedUpAnimation();

        //解决加速结束时跳下无法再跳起bug
        this._isJumping = false;
    },
    cancleInvicibleState: function () {
        //取消无敌状态
        this._postman.setInvicible(false);
    },
    startCreateTreeAndMonster: function (isNormalRate) {
        this.unschedule(this.addTree);
        this.unschedule(this.addMonster);
        this.unschedule(this.addBarrier);
        this.unschedule(this.addItem);
        this.unschedule(this.addSubTitle);

        if (!this._isStop)
        {
            if (isNormalRate)
            {
                this.schedule(this.addTree, 1);
                this.schedule(this.addMonster, 2);
                this.schedule(this.addBarrier, 2, cc.REPEAT_FOREVER, 0.6);
                this.schedule(this.addItem, 3, cc.REPEAT_FOREVER, 1);
                this.schedule(this.addSubTitle, 2);
            }
            else
            {
                //加速模式下，加快生成树和怪物的速率
                this.schedule(this.addTree, 0.5);
                this.schedule(this.addMonster, 1);
                this.schedule(this.addBarrier, 1, cc.REPEAT_FOREVER, 0.3);
                this.schedule(this.addItem, 1.5, cc.REPEAT_FOREVER, 0.5);
                this.schedule(this.addSubTitle, 2);
            }
        }
    },
    pauseAllMonsterAnimation: function () {
        var enermys = this._monsterNode.getChildren();
        for (var i in enermys)
        {
            //停止骨骼动作
            if (enermys[i].getType() == ItemType.monster)
            {
                enermys[i].pauseAction();
            }
        }
    },
    resumeAllMonsterAnimation: function () {
        var enermys = this._monsterNode.getChildren();
        for (var i in enermys)
        {
            //停止骨骼动作
            if (enermys[i].getType() == ItemType.monster)
            {
                enermys[i].resumeAction();
            }
        }
    },
    playSpeedUpAnimation: function () {
        if (this._speedupAnimation == null)
        {
            //this._speedupAnimation = new sp.SkeletonAnimation("res/spine/jstx/jstx.json", "res/spine/jstx/jstx.atlas");
            this._speedupAnimation = createSkeletonAnimation("jstx", "res/spine/jstx/jstx.json", "res/spine/jstx/jstx.atlas");
            this._speedupAnimation.setAnimation(0, "animation", true);
            this.addChild(this._speedupAnimation);
        }
    },
    playNewRecordAnimation: function () {
        if (this._newRecordAnimation == null)
        {
            if (IsChinese)
            {
                this._newRecordAnimation = createSkeletonAnimation("tupotx", "res/spine/tupotx/tupotx.json", "res/spine/tupotx/tupotx.atlas");
            }
            else
            {
                this._newRecordAnimation = createSkeletonAnimation("tupotx", "res/spine/tupotxa/tupotxa.json", "res/spine/tupotxa/tupotxa.atlas");
            }
            this._newRecordAnimation.setAnimation(0, "tupo", false);
            this._newRecordAnimation.setPosition(0, ScreenHight);
            this.addChild(this._newRecordAnimation);
        }
    },
    playReviveAnimation: function () {
        if (this._reviveAnimation == null)
        {
            //this._reviveAnimation = new sp.SkeletonAnimation("res/spine/fuhuo/fuhuo.json", "res/spine/fuhuo/fuhuo.atlas");
            this._reviveAnimation = createSkeletonAnimation("fuhuo", "res/spine/fuhuo/fuhuo.json", "res/spine/fuhuo/fuhuo.atlas");
            this.addChild(this._reviveAnimation);
        }

        var self = this;
        this._reviveAnimation.setPosition(this._postman.getPosition());
        this._reviveAnimation.setAnimation(0, "animation", false);
        this._reviveAnimation.setEndListener(function (trackIndex) {
            var entry = self._reviveAnimation.getCurrent(trackIndex);
            if(entry)
            {
                var animationName = entry.animation ? entry.animation.name : "";
                if (animationName == "animation")
                {
                    self.reviveCallBack();
                }
            }
        });
    },
    playAddMonsterAnimation: function (roadIdx) {
        if (this._addMonsterAnimation == null)
        {
            //this._addMonsterAnimation = new sp.SkeletonAnimation("res/spine/chuguai/chuguaits.json", "res/spine/chuguai/chuguaits.atlas");
            this._addMonsterAnimation = createSkeletonAnimation("chuguaits", "res/spine/chuguai/chuguaits.json", "res/spine/chuguai/chuguaits.atlas");
            this.addChild(this._addMonsterAnimation);
        }

        var self = this;
        this._addMonsterAnimation.setLocalZOrder(ZOrderOnRoad[roadIdx]);
        this._addMonsterAnimation.setPosition(1180, RoadPosY[roadIdx]);
        this._addMonsterAnimation.setAnimation(0, "animation", false);
        this._addMonsterAnimation.setEndListener(function (trackIndex) {
            var entry = self._addMonsterAnimation.getCurrent(trackIndex);
            if(entry)
            {
                var animationName = entry.animation ? entry.animation.name : "";
                if (animationName == "animation")
                {
                    self.showOppositeMonster(roadIdx);
                }
            }
        });

        //播放警告音效
        SoundManager.playWarningEffect();
    },
    //下一关开启动画
    playNextLevelAniamtion: function () {
        if (this._nextLevelAnimation == null)
        {
            this._nextLevelAnimation = createSkeletonAnimation("tupotx", "res/spine/tupotx/tupotx.json", "res/spine/tupotx/tupotx.atlas");
            this._nextLevelAnimation.setAnimation(0, "tupo", false);
            this._nextLevelAnimation.setPosition(0, ScreenHight);
            this.addChild(this._nextLevelAnimation);
        }
    },
    //掉血动画
    playDropLifeAnimation: function () {
        if (this._dropLifeAnimation == null)
        {
            this._dropLifeAnimation = createSkeletonAnimation("dropblood", "res/spine/shanhong/shanhong.json", "res/spine/shanhong/shanhong.atlas");
            this._dropLifeAnimation.setPosition(ScreenWidth/2, 0)
            this.addChild(this._dropLifeAnimation);
        }

        this._dropLifeAnimation.setAnimation(0, "animation", false);
    },
    showOppositeMonster: function (roadIdx) {
        //随机怪物类型
        var monster = this.createRandomMonster();
        monster.setScaleX(-1);
        this._monsterNode.addChild(monster);

        monster.setLocalZOrder(ZOrderOnRoad[roadIdx]);
        monster.setPosition(RoadPosX + 50, RoadPosY[roadIdx]);
        monster.playWalk();
    },
    cancleSpeedUpAnimation: function () {
        if (this._speedupAnimation != null)
        {
            this._speedupAnimation.removeFromParent();
            this._speedupAnimation = null;
        }
    },
    removeNewRecordAnimation: function () {
        if (this._newRecordAnimation != null)
        {
            this._newRecordAnimation.removeFromParent();
            this._newRecordAnimation = null;
        }
    },
    removeReviveAnimation: function () {
        if (this._reviveAnimation != null)
        {
            this._reviveAnimation.removeFromParent();
            this._reviveAnimation = null;
        }
    },
    recordHighestLength: function () {
        var highestLen = GameStorage.getLevelPassedLength(this._levelName);
        if (highestLen == undefined || this._passedLength > highestLen)
        {
            cc.log("recordHighestLength:%d", this._passedLength);
            GameStorage.setLevelPassedLength(this._levelName, this._passedLength);
        }
    },
    stopGame: function () {
        this._isStop = true;

        this.unschedule(this.addTree);
        this.unschedule(this.addMonster);
        this.unschedule(this.addBarrier);
        this.unschedule(this.addItem);
        this.unschedule(this.addSubTitle);
    },
    checkResult: function () {
        if (this._levelMode == LevelMode.endless
            && this._passedLength > this._moveSpeed * 60 * 300)
        {
            //记录最高距离
            this.recordHighestLength();
            this.onSuccess();
        }
        else
        {
            this.onFailed();
        }
    },
    delaySetGold: function () {
        var delay = cc.DelayTime(0.1);
        var callFunc = cc.callFunc(function (self) {
            GameStorage.setUserGold(GlobalGold);
        });
        this.runAction(cc.sequence(delay, callFunc));
    },
    onFailed: function () {

        //弹幕,间隔2S
        this.addDeadSubTitle();
        this.schedule(this.addDeadSubTitle, 2);

        SoundManager.playLoseEffect();

        //记录最高距离
        this.recordHighestLength();

        this._uiMain.disableKeyboard();
        //显示失败界面
        this.delayShowFailedUI();
    },
    onSuccess: function () {

        this._success = true;
        SoundManager.closeBgm();
        SoundManager.playWinEffect();
        //通关记录
        GameStorage.setLevelClear(this._levelName);
        GameStorage.openLevel(this._nextLevelName);
        this._postman.setInvicible(true);
        if (this.isSpeedUpMode())
        {
            this.cancleSpeedUp();
        }

        this._uiMain.disableKeyboard();
        //显示成功界面
        this.delayShowSuccessUI();
    },
    delayShowSuccessUI: function () {
        var delay = cc.DelayTime(1);
        var callFunc = cc.callFunc(function (self) {
            self.delaySetGold();

            var uiSuccess = new UISuccess();
            uiSuccess.init();
            uiSuccess.setMainLayerDelegate(self);
            cc.director.getRunningScene().addChild(uiSuccess);
        });
        this.runAction(cc.sequence(delay, callFunc));
    },
    delayShowFailedUI: function () {
        var delay = cc.DelayTime(1);
        var callFunc = cc.callFunc(function (self) {
            self.delaySetGold();

            var uiFailed = new UIFail();
            uiFailed.init();
            uiFailed.setMainLayerDelegate(self);
            cc.director.getRunningScene().addChild(uiFailed);
        });
        this.runAction(cc.sequence(delay, callFunc));
    },
    showSubTitle: function (type, percent) {
        var localPercent = percent;
        if (percent == undefined)
        {
            localPercent = 100;
        }

        var r = GameRandomInt(1, 100);
        if (r <= localPercent)
        {
            var posY = GameRandomInt(400, 700);
            var label = new ccui.Text();
            label.setFontName("res/Font/DFWaWaW5.TTF");
            label.setString(this.getSubTitleString(type));
            label.setFontSize(40);
            label.enableOutline(cc.color.BLACK, 3);
            label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            label.setAnchorPoint(cc.p(0, 0.5));
            label.setPosition(cc.p(ScreenWidth, posY));
            this.addChild(label);

            var textLength = label.getVirtualRendererSize().width;
            var moveLength = ScreenWidth + textLength;
            var moveBy = cc.moveBy(moveLength/300, cc.p(-moveLength, 0));
            var callFunc = cc.callFunc(function (sender, value) {
                sender.removeFromParent();
            });
            label.runAction(cc.sequence(moveBy, callFunc));
        }
    },
    getSubTitleString: function (type) {
        var arr = InitData.getSubTitleArray(type);
        var idx = GameRandomInt(0, arr.length-1);
        //cc.log("idx:%d, length:%d", idx, arr.length-1);
        return arr[idx];
    }
});

//主场景
var MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var enterUI = new UIEnter();
        enterUI.init();
        this.addChild(enterUI);
    },
});