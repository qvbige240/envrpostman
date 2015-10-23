//
//  GameHelper.h
//  PostmanRush
//
//  Created by qianmengxi on 15-7-14.
//
//

#ifndef __PostmanRush__GameHelper__
#define __PostmanRush__GameHelper__

#include <stdio.h>
#include "cocos2d.h"

USING_NS_CC;

class GameHelper:public Node
{
public:
    static GameHelper* getInstance();
    bool init();
    //uucun SDK支付
    void onUUCunPaySuccess();
    void uucunPay(const char* productName, int amount);
    
    //百事通SDK支付
    void onBstPaySuccess();
    void bstPay(const char* productID, const char* productName, const char* productPrice, const char* productNum);
    
    //umeng分享
    void umengShare();
    void onShareSuccess();
    
    //排行榜
    void showRank();
    
    std::string getLanguage();
    
    GameHelper();
    ~GameHelper();
};
#endif /* defined(__PostmanRush__GameHelper__) */
