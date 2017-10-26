package com.matchupmatchapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.oblador.vectoricons.VectorIconsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new WebRTCModulePackage(),
            new ReactNativePushNotificationPackage(),
            new InCallManagerPackage(),
            new ReactVideoPackage(),
            new OrientationPackage(),
            new PickerPackage(),
            new ReactNativeYouTube(),
            new VectorIconsPackage(),
            new ReactNativeI18n(),
            new ReactNativeConfigPackage(),
            new MapsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
