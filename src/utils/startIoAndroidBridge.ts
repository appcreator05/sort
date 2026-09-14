// Utility to communicate directly with Android APK Start.io Native SDK
// Supports WebView, Website 2 APK Builder, Capacitor, Cordova, and Custom Android Interfaces

export const START_IO_APP_ID = '203877183';

declare global {
  interface Window {
    Android?: {
      showInterstitial?: () => void;
      showBanner?: () => void;
      showRewardedVideo?: () => void;
      trackImpression?: (adId: string) => void;
      trackClick?: (adId: string) => void;
      [key: string]: any;
    };
    StartApp?: {
      showInterstitial?: () => void;
      showBanner?: () => void;
      showRewardedVideo?: () => void;
      [key: string]: any;
    };
    startApp?: any;
    Website2APK?: {
      showInterstitial?: () => void;
      showBanner?: () => void;
      [key: string]: any;
    };
    showInterstitial?: () => void;
    showBanner?: () => void;
    showRewardedVideo?: () => void;
  }
}

/**
 * Trigger Android Native Start.io Interstitial Ad
 * Invoked on movie poster click or category page navigation
 */
export function triggerNativeStartIoInterstitial(): boolean {
  try {
    // 1. Check custom Android JavaScriptInterface
    if (window.Android && typeof window.Android.showInterstitial === 'function') {
      window.Android.showInterstitial();
      console.log('[Start.io APK] Triggered window.Android.showInterstitial()');
      return true;
    }

    // 2. Check window.StartApp interface
    if (window.StartApp && typeof window.StartApp.showInterstitial === 'function') {
      window.StartApp.showInterstitial();
      console.log('[Start.io APK] Triggered window.StartApp.showInterstitial()');
      return true;
    }

    // 3. Check Website 2 APK Builder interface
    if (window.Website2APK && typeof window.Website2APK.showInterstitial === 'function') {
      window.Website2APK.showInterstitial();
      console.log('[Start.io APK] Triggered window.Website2APK.showInterstitial()');
      return true;
    }

    // 4. Check global function showInterstitial
    if (typeof window.showInterstitial === 'function') {
      window.showInterstitial();
      console.log('[Start.io APK] Triggered window.showInterstitial()');
      return true;
    }
  } catch (err) {
    console.error('[Start.io APK Bridge Error]', err);
  }
  return false;
}

/**
 * Trigger Android Native Start.io Banner Ad
 */
export function triggerNativeStartIoBanner(): boolean {
  try {
    if (window.Android && typeof window.Android.showBanner === 'function') {
      window.Android.showBanner();
      return true;
    }
    if (window.StartApp && typeof window.StartApp.showBanner === 'function') {
      window.StartApp.showBanner();
      return true;
    }
    if (window.Website2APK && typeof window.Website2APK.showBanner === 'function') {
      window.Website2APK.showBanner();
      return true;
    }
    if (typeof window.showBanner === 'function') {
      window.showBanner();
      return true;
    }
  } catch (err) {
    console.error('[Start.io APK Banner Error]', err);
  }
  return false;
}

/**
 * Signal Native Android Click/Impression Tracking to Native Start.io SDK
 */
export function reportStartIoInteraction(type: 'impression' | 'click', adId: string = 'general') {
  try {
    if (window.Android) {
      if (type === 'impression' && typeof window.Android.trackImpression === 'function') {
        window.Android.trackImpression(adId);
      } else if (type === 'click' && typeof window.Android.trackClick === 'function') {
        window.Android.trackClick(adId);
      }
    }
  } catch (e) {
    // Ignore bridge errors in non-Android environments
  }
}
