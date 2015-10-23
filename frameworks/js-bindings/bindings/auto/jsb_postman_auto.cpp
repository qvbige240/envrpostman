#include "jsb_postman_auto.hpp"
#include "cocos2d_specifics.hpp"
#include "../../runtime-src/Classes/GameHelper.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedValue initializing(cx);
    bool isNewValid = true;
    JS::RootedObject global(cx, ScriptingCore::getInstance()->getGlobalObject());
    isNewValid = JS_GetProperty(cx, global, "initializing", &initializing) && initializing.toBoolean();
    if (isNewValid)
    {
        TypeTest<T> t;
        js_type_class_t *typeClass = nullptr;
        std::string typeName = t.s_name();
        auto typeMapIter = _js_global_type_map.find(typeName);
        CCASSERT(typeMapIter != _js_global_type_map.end(), "Can't find the class type!");
        typeClass = typeMapIter->second;
        CCASSERT(typeClass, "The value is null.");

        JS::RootedObject proto(cx, typeClass->proto.get());
        JS::RootedObject parent(cx, typeClass->parentProto.get());
        JS::RootedObject _tmp(cx, JS_NewObject(cx, typeClass->jsclass, proto, parent));
        
        args.rval().set(OBJECT_TO_JSVAL(_tmp));
        return true;
    }

    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;    
}
JSClass  *jsb_GameHelper_class;
JSObject *jsb_GameHelper_prototype;

bool js_postman_GameHelper_onShareSuccess(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_onShareSuccess : Invalid Native Object");
    if (argc == 0) {
        cobj->onShareSuccess();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_onShareSuccess : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_postman_GameHelper_bstPay(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_bstPay : Invalid Native Object");
    if (argc == 4) {
        const char* arg0;
        const char* arg1;
        const char* arg2;
        const char* arg3;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        std::string arg2_tmp; ok &= jsval_to_std_string(cx, args.get(2), &arg2_tmp); arg2 = arg2_tmp.c_str();
        std::string arg3_tmp; ok &= jsval_to_std_string(cx, args.get(3), &arg3_tmp); arg3 = arg3_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_postman_GameHelper_bstPay : Error processing arguments");
        cobj->bstPay(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_bstPay : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_postman_GameHelper_onUUCunPaySuccess(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_onUUCunPaySuccess : Invalid Native Object");
    if (argc == 0) {
        cobj->onUUCunPaySuccess();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_onUUCunPaySuccess : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_postman_GameHelper_init(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_init : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->init();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_init : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_postman_GameHelper_umengShare(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_umengShare : Invalid Native Object");
    if (argc == 0) {
        cobj->umengShare();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_umengShare : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_postman_GameHelper_getLanguage(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_getLanguage : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getLanguage();
        jsval jsret = JSVAL_NULL;
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_getLanguage : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_postman_GameHelper_showRank(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_showRank : Invalid Native Object");
    if (argc == 0) {
        cobj->showRank();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_showRank : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_postman_GameHelper_uucunPay(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_uucunPay : Invalid Native Object");
    if (argc == 2) {
        const char* arg0;
        int arg1;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_postman_GameHelper_uucunPay : Error processing arguments");
        cobj->uucunPay(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_uucunPay : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_postman_GameHelper_onBstPaySuccess(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    GameHelper* cobj = (GameHelper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_postman_GameHelper_onBstPaySuccess : Invalid Native Object");
    if (argc == 0) {
        cobj->onBstPaySuccess();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_postman_GameHelper_onBstPaySuccess : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_postman_GameHelper_getInstance(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        GameHelper* ret = GameHelper::getInstance();
        jsval jsret = JSVAL_NULL;
        do {
        if (ret) {
            js_proxy_t *jsProxy = js_get_or_create_proxy<GameHelper>(cx, (GameHelper*)ret);
            jsret = OBJECT_TO_JSVAL(jsProxy->obj);
        } else {
            jsret = JSVAL_NULL;
        }
    } while (0);
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "js_postman_GameHelper_getInstance : wrong number of arguments");
    return false;
}

bool js_postman_GameHelper_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    GameHelper* cobj = new (std::nothrow) GameHelper();
    cocos2d::Ref *_ccobj = dynamic_cast<cocos2d::Ref *>(cobj);
    if (_ccobj) {
        _ccobj->autorelease();
    }
    TypeTest<GameHelper> t;
    js_type_class_t *typeClass = nullptr;
    std::string typeName = t.s_name();
    auto typeMapIter = _js_global_type_map.find(typeName);
    CCASSERT(typeMapIter != _js_global_type_map.end(), "Can't find the class type!");
    typeClass = typeMapIter->second;
    CCASSERT(typeClass, "The value is null.");
    // JSObject *obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
    JS::RootedObject proto(cx, typeClass->proto.get());
    JS::RootedObject parent(cx, typeClass->parentProto.get());
    JS::RootedObject obj(cx, JS_NewObject(cx, typeClass->jsclass, proto, parent));
    args.rval().set(OBJECT_TO_JSVAL(obj));
    // link the native object with the javascript object
    js_proxy_t* p = jsb_new_proxy(cobj, obj);
    AddNamedObjectRoot(cx, &p->obj, "GameHelper");
    if (JS_HasProperty(cx, obj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    return true;
}


extern JSObject *jsb_cocos2d_Node_prototype;

void js_GameHelper_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (GameHelper)", obj);
}

void js_register_postman_GameHelper(JSContext *cx, JS::HandleObject global) {
    jsb_GameHelper_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_GameHelper_class->name = "GameHelper";
    jsb_GameHelper_class->addProperty = JS_PropertyStub;
    jsb_GameHelper_class->delProperty = JS_DeletePropertyStub;
    jsb_GameHelper_class->getProperty = JS_PropertyStub;
    jsb_GameHelper_class->setProperty = JS_StrictPropertyStub;
    jsb_GameHelper_class->enumerate = JS_EnumerateStub;
    jsb_GameHelper_class->resolve = JS_ResolveStub;
    jsb_GameHelper_class->convert = JS_ConvertStub;
    jsb_GameHelper_class->finalize = js_GameHelper_finalize;
    jsb_GameHelper_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("onShareSuccess", js_postman_GameHelper_onShareSuccess, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("bstPay", js_postman_GameHelper_bstPay, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onUUCunPaySuccess", js_postman_GameHelper_onUUCunPaySuccess, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("init", js_postman_GameHelper_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("umengShare", js_postman_GameHelper_umengShare, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLanguage", js_postman_GameHelper_getLanguage, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("showRank", js_postman_GameHelper_showRank, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("uucunPay", js_postman_GameHelper_uucunPay, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onBstPaySuccess", js_postman_GameHelper_onBstPaySuccess, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getInstance", js_postman_GameHelper_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_GameHelper_prototype = JS_InitClass(
        cx, global,
        JS::RootedObject(cx, jsb_cocos2d_Node_prototype),
        jsb_GameHelper_class,
        js_postman_GameHelper_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);
    // make the class enumerable in the registered namespace
//  bool found;
//FIXME: Removed in Firefox v27 
//  JS_SetPropertyAttributes(cx, global, "GameHelper", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

    // add the proto and JSClass to the type->js info hash table
    TypeTest<GameHelper> t;
    js_type_class_t *p;
    std::string typeName = t.s_name();
    if (_js_global_type_map.find(typeName) == _js_global_type_map.end())
    {
        p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
        p->jsclass = jsb_GameHelper_class;
        p->proto = jsb_GameHelper_prototype;
        p->parentProto = jsb_cocos2d_Node_prototype;
        _js_global_type_map.insert(std::make_pair(typeName, p));
    }
}

void register_all_postman(JSContext* cx, JS::HandleObject obj) {

    js_register_postman_GameHelper(cx, obj);
}

