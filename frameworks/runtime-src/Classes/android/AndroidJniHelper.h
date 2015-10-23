//
//  AndroidJniHelper.h
//  PostmanRush
//
//  Created by qianmengxi on 15-7-15.
//
//

#ifndef __PostmanRush__AndroidJniHelper__
#define __PostmanRush__AndroidJniHelper__

#include <iostream>

extern "C"
{
    void UUCunPay(const char* productName, int amount);
    void BstPay(const char* productID, const char* productName, const char* productPrice, const char* productNum);
    void android_umengShare();
    void android_showRank();
    std::string android_getLanguage();
}

#endif /* defined(__PostmanRush__AndroidJniHelper__) */
