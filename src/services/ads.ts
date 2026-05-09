export const UNITY_ADS_CONFIG = {
  ios: {
    gameId: '6083634',
    banner: 'Banner_iOS',
    interstitial: 'Interstitial_iOS',
    rewarded: 'Rewarded_iOS',
  },
  android: {
    gameId: '6083635',
    banner: 'Banner_Android',
    interstitial: 'Interstitial_Android',
    rewarded: 'Rewarded_Android',
  },
};

declare global {
  interface Window {
    UnityAds?: any;
    unityAds?: any;
  }
}

export function getPlatformConfig() {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  return isIOS ? UNITY_ADS_CONFIG.ios : UNITY_ADS_CONFIG.android;
}

export function getUnityAds() {
  return window.UnityAds || window.unityAds || null;
}

// Single flag to prevent double-init
let _initialized = false;
let _initCallbacks: Array<() => void> = [];

function onInitComplete() {
  _initialized = true;
  _initCallbacks.forEach((cb) => cb());
  _initCallbacks = [];
}

export function initAds() {
  if (_initialized) return;
  const ads = getUnityAds();
  if (!ads) {
    // SDK not yet in window (web view may still be loading)
    // Retry once after 2s
    setTimeout(() => {
      if (!_initialized) initAds();
    }, 2000);
    return;
  }
  const config = getPlatformConfig();
  try {
    ads.initialize(config.gameId, false, {
      onComplete: onInitComplete,
      onFailed: (error: any, message: string) => {
        console.error('Unity Ads Init Failed:', error, message);
      },
    });
  } catch (e) {
    // Older SDK uses `init` not `initialize`
    try {
      ads.init(config.gameId, false, {
        onComplete: onInitComplete,
        onFailed: (error: any, message: string) => {
          console.error('Unity Ads Init Failed:', error, message);
        },
      });
    } catch (e2) {
      console.error('Unity Ads Init Error:', e2);
    }
  }
}

export function isAdsReady() {
  return _initialized;
}

/** Run `cb` immediately if ads are ready, or queue it for when init completes */
function whenReady(cb: () => void) {
  if (_initialized) {
    cb();
  } else {
    _initCallbacks.push(cb);
  }
}

export function showBannerAd(placementId: string) {
  const ads = getUnityAds();
  if (!ads) return;
  whenReady(() => {
    try {
      ads.load(placementId, {
        onComplete: (id: string) => {
          try { ads.show(id); } catch (_) {}
        },
        onFailed: (id: string, err: any, msg: string) => {
          console.warn('Banner load failed:', id, err, msg);
        },
      });
    } catch (e) {
      console.warn('Banner load error:', e);
    }
  });
}

export function showInterstitial() {
  const ads = getUnityAds();
  if (!ads) return;
  const config = getPlatformConfig();
  whenReady(() => {
    try {
      ads.load(config.interstitial, {
        onComplete: (id: string) => {
          try { ads.show(id); } catch (_) {}
        },
        onFailed: (id: string, err: any, msg: string) => {
          console.warn('Interstitial failed:', id, err, msg);
        },
      });
    } catch (e) {
      console.warn('Interstitial error:', e);
    }
  });
}

export function showRewarded(onGranted?: () => void) {
  const ads = getUnityAds();
  if (!ads) return;
  const config = getPlatformConfig();
  whenReady(() => {
    try {
      ads.load(config.rewarded, {
        onComplete: (id: string) => {
          try {
            ads.show(id, {
              onComplete: () => onGranted?.(),
              onSkipped: () => {},
              onFailed: () => {},
            });
          } catch (_) {}
        },
        onFailed: (id: string, err: any, msg: string) => {
          console.warn('Rewarded failed:', id, err, msg);
        },
      });
    } catch (e) {
      console.warn('Rewarded error:', e);
    }
  });
}
