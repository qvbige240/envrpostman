//
//  AndroidJniHelper.cpp
//  javascript
//
//  Created by qianmengxi on 15-7-15.
//
//

#include "AndroidJniHelper.h"
#include <jni.h>
#include <string>
#include <android/log.h>
#include "../../../js-bindings/cocos2d-x/cocos/platform/android/jni/JniHelper.h"
#include "../GameHelper.h"

#define  GAMELOG(...)  __android_log_print(ANDROID_LOG_DEBUG, "AndroidJniHelper.cpp", __VA_ARGS__)

using namespace cocos2d;
using namespace std;

extern "C"
{
    void UUCunPay(const char* productName, int amount)
    {
        JniMethodInfo t;
        
        if (JniHelper::getStaticMethodInfo(t, "org/cocos2dx/javascript/AppActivity", "pay", "(Ljava/lang/String;I)V")) {
            jstring stringArg = t.env->NewStringUTF(productName);
            t.env->CallStaticVoidMethod(t.classID, t.methodID, stringArg, amount);
            
            t.env->DeleteLocalRef(t.classID);
            t.env->DeleteLocalRef(stringArg);
        }
    }
    
    void BstPay(const char* productID, const char* productName, const char* productPrice, const char* productNum)
    {
        JniMethodInfo t;
        
        if (JniHelper::getStaticMethodInfo(t, "org/cocos2dx/javascript/AppActivity", "pay", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V")) {
            jstring stringArg0 = t.env->NewStringUTF(productID);
            jstring stringArg1 = t.env->NewStringUTF(productName);
            jstring stringArg2 = t.env->NewStringUTF(productPrice);
            jstring stringArg3 = t.env->NewStringUTF(productNum);
            t.env->CallStaticVoidMethod(t.classID, t.methodID, stringArg0, stringArg1, stringArg2, stringArg3);
            
            t.env->DeleteLocalRef(t.classID);
            t.env->DeleteLocalRef(stringArg0);
            t.env->DeleteLocalRef(stringArg1);
            t.env->DeleteLocalRef(stringArg2);
            t.env->DeleteLocalRef(stringArg3);
        }
    }
    
    void android_umengShare()
    {
        JniMethodInfo t;
        
        if (JniHelper::getStaticMethodInfo(t, "org/cocos2dx/javascript/AppActivity", "umengShare", "()V")) {
            t.env->CallStaticVoidMethod(t.classID, t.methodID);
            t.env->DeleteLocalRef(t.classID);
        }
    }
    
    std::string android_getLanguage()
    {
        std::string retStr;
        JniMethodInfo t;
        
        if (JniHelper::getStaticMethodInfo(t, "org/cocos2dx/javascript/AppActivity", "getLanguage", "()Ljava/lang/String;")) {
            jstring retFromJava = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
            const char* str = t.env->GetStringUTFChars(retFromJava, 0);
            retStr = str;
            t.env->ReleaseStringUTFChars(retFromJava, str);
            t.env->DeleteLocalRef(t.classID);
            
            return retStr;
        }
        
        return retStr;
    }
    
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_onBstPaySuccess(JNIEnv*  env, jobject thiz)
    {
        GAMELOG("onBstPaySuccess");
        GameHelper::getInstance()->onBstPaySuccess();
    }
    
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_onShareSuccess(JNIEnv*  env, jobject thiz)
    {
        GAMELOG("onShareSuccess");
        GameHelper::getInstance()->onShareSuccess();
    }
}
