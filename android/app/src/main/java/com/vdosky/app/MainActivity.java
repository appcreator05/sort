package com.vdosky.app;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import com.getcapacitor.BridgeActivity;
import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.StartAppSDK;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Start.io Native In-App SDK with App ID: 203877183
        // false = Live production ads (counts real Impressions, Clicks, and Revenue)
        StartAppSDK.init(this, "203877183", false);
        StartAppSDK.enableReturnAds(false);

        // Register Android JavascriptInterface to allow web app to trigger native ads
        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                this.bridge.getWebView().addJavascriptInterface(new Object() {
                    @JavascriptInterface
                    public void showInterstitial() {
                        runOnUiThread(() -> {
                            StartAppAd.showAd(MainActivity.this);
                        });
                    }

                    @JavascriptInterface
                    public void showBanner() {
                        // Native banner trigger if needed
                    }

                    @JavascriptInterface
                    public void trackImpression(String adId) {
                        // Log native impression
                    }

                    @JavascriptInterface
                    public void trackClick(String adId) {
                        // Log native click
                    }
                }, "Android");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
