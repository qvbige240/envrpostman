//
//  GameHelper.cpp
//  PostmanRush
//
//  Created by qianmengxi on 15-7-14.
//
//

#include "GameHelper.h"
#include "cocos2d.h"
#include "ScriptingCore.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "android/AndroidJniHelper.h"
#endif

using namespace cocos2d;

static GameHelper* s_gameHelperIns = nullptr;
GameHelper* GameHelper::getInstance()
{
    if (!s_gameHelperIns) {
        s_gameHelperIns = new GameHelper();
        s_gameHelperIns->init();
    }
    
    return s_gameHelperIns;
}

bool GameHelper::init()
{
    return Node::init();
}

void GameHelper::onUUCunPaySuccess()
{
    js_proxy_t* p = jsb_get_native_proxy(this);
    jsval v[] = {
        v[0] = UINT_TO_JSVAL(0),
        v[1] = UINT_TO_JSVAL(0)
    };
    ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "callback", 2, v);
}

void GameHelper::uucunPay(const char* productName, int amount)
{
    CCLOG("GameHelper pay success! productName:%s, amount:%d", productName, amount);
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    UUCunPay(productName, amount);
#endif
}

GameHelper::GameHelper()
{
    CCLOG("GameHelper constructor call!");
}

GameHelper::~GameHelper()
{
    CCLOG("GameHelper destructor call!");
}

void GameHelper::onBstPaySuccess()
{
    js_proxy_t* p = jsb_get_native_proxy(this);
    jsval v[] = {
        v[0] = UINT_TO_JSVAL(0),
        v[1] = UINT_TO_JSVAL(0)
    };
    ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "callback", 2, v);
}

void GameHelper::bstPay(const char* productID, const char* productName, const char* productPrice, const char* productNum)
{
    CCLOG("GameHelper pay success! productName:%s, %s, %s, %s", productID, productName, productPrice, productNum);
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    BstPay(productID, productName, productPrice, productNum);
#endif
}

void GameHelper::umengShare()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    CCLOG("GameHelper::umengShare");
    android_umengShare();
#endif
    
}

void GameHelper::showRank()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    CCLOG("GameHelper::showRank");
#endif
}

void GameHelper::onShareSuccess()
{
    js_proxy_t* p = jsb_get_native_proxy(this);
    jsval v[] = {
        v[0] = UINT_TO_JSVAL(0),
    };
    ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "callback", 1, v);
}

std::string GameHelper::getLanguage()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    CCLOG("GameHelper::getLanguage");
    return android_getLanguage();
#else
    return "zh";
#endif

}