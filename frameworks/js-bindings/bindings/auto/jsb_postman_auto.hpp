#ifndef __postman_h__
#define __postman_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_GameHelper_class;
extern JSObject *jsb_GameHelper_prototype;

bool js_postman_GameHelper_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_postman_GameHelper_finalize(JSContext *cx, JSObject *obj);
void js_register_postman_GameHelper(JSContext *cx, JS::HandleObject global);
void register_all_postman(JSContext* cx, JS::HandleObject obj);
bool js_postman_GameHelper_onShareSuccess(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_bstPay(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_onUUCunPaySuccess(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_init(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_umengShare(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_getLanguage(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_showRank(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_uucunPay(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_onBstPaySuccess(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_getInstance(JSContext *cx, uint32_t argc, jsval *vp);
bool js_postman_GameHelper_GameHelper(JSContext *cx, uint32_t argc, jsval *vp);
#endif

