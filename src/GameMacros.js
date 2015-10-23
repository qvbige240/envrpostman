/**
 * Created by qianmengxi on 15-6-1.
 */
var ScreenWidth = 1280;
var ScreenHight = 720;
var MinBarrierTypeID = 1;
var MaxBarrierTypeID = 3;
var LeftBoundaryPosX = -300;//边界x坐标 -150
var RightBoundaryPosX = ScreenWidth+500;

//道路两旁树的起始坐标
var TreePosX = ScreenWidth;
var TopTreePosY = 380;
var BottomTreePosY = 50;

//Tag值
var PostmanTag = 100;

//一共4车道
var MaxRoadIdx = 4;
//道路y坐标数组
var RoadPosY = new Array(165, 235, 295, 350);
//路上怪物和邮递员的层级
var ZOrderOnRoad = new Array(8, 6, 4, 2);
//道路x坐标数组
var RoadPosX = ScreenWidth;
var PostmanInitPosX = ScreenWidth*1/2.618;

//移动方向
var MoveDirection = {};
MoveDirection.up = 1;
MoveDirection.down = 2;

//敌人类型:怪物和障碍物
var ItemType = {};
ItemType.none = 0;
ItemType.monster = 1;
ItemType.barrier = 2;
ItemType.gold = 3;
ItemType.accelerator = 4;  //加速器

//弹幕类型
var SubTitleType = {};
SubTitleType.speedup = 1;
SubTitleType.runing = 2;
SubTitleType.gold = 3;
SubTitleType.dead = 4;

//关卡模式，普通和无尽
var LevelMode = {};
LevelMode.normal = 1;
LevelMode.endless = 2;

//加速时长,秒
var SpeedUpTime = 4.0;
//无敌时长
var InvincibleTime = 5.0;
var GlobalData = {};
var PreSoundPath = "res/Sound/";
var GlobalGold = 0;

var SkeletonCache = {};
var AddGoldVal = 0;//充值金币数
var IsDoubleGold = false;//是否双倍金币获得
var IsRevive = false;//是否购买了复活
var IsShareSuccess = false;//是否分享成功

var IsChinese = true;
var EnableKeyboard = false;
var NeedGoldEn = "Need more gold!";
var NeedGoldCh = "金币不足";
