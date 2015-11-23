/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import java.util.Locale;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.util.Log;

import java.io.IOException;
import java.util.HashMap;

//import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxEditText;
//import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.GameAppConfig;
import org.xmlpull.v1.XmlPullParserException;

import android.content.res.Resources;
import android.content.res.XmlResourceParser;
import android.os.Bundle;

public class AppActivity extends Cocos2dxActivity {
	
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

		GameAppConfig.mHashMap = parserKeyValueXML(this, org.cocos2dx.envrpostman.R.xml.keymap);

        return glSurfaceView;
    }

	// Key value XML parser
	public static HashMap<Integer, Integer> parserKeyValueXML(AppActivity activity, int xmlID) {
		Resources res = activity.getResources();
		XmlResourceParser xmlParser = res.getXml(xmlID);
		HashMap<Integer, Integer> mMap = new HashMap<Integer, Integer>();

		try {
			int eventType = xmlParser.getEventType();
		     // File end?
			while (eventType != XmlResourceParser.END_DOCUMENT) {
				if (eventType == XmlResourceParser.START_TAG) {
					String tagname = xmlParser.getName();
					if (tagname.endsWith("key")) {
						//Log.v("====Error", xmlParser.getAttributeValue(null, "eurowing") + " ####  " + xmlParser.getAttributeValue(null, "game"));
						mMap.put(
							Integer.parseInt(xmlParser.getAttributeValue(null, "eurowing")), //eurowing actual key value
							Integer.parseInt(xmlParser.getAttributeValue(null, "game")));    //mapping game needs key value
	 				}
				} else if (eventType == XmlResourceParser.END_TAG) {

				} else if (eventType == XmlResourceParser.TEXT) {

				}
				eventType = xmlParser.next();
			}
		} catch (XmlPullParserException e) {

		} catch (IOException e) {
			e.printStackTrace();
		}
		xmlParser.close();
		return mMap;
	}

    public static String getLanguage()
    {
    	String lan = Locale.getDefault().getLanguage();
    	//Log.e("javascript", "language:"+lan);
		return lan;
    }
}
