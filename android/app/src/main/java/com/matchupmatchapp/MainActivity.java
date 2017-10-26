package com.matchupmatchapp;
import android.content.Intent;
import android.content.res.Configuration;
import com.facebook.react.ReactActivity;
import com.airbnb.android.react.maps.MapsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.github.yamill.orientation.OrientationPackage;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MatchupMatchApp";
    }
    @Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
