// AdMob configuration — reemplaza Unity Ads
export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-3849768825456219~7335875202',
  banner: 'ca-app-pub-3849768825456219/9269956715',
};

declare global {
  interface Window {
    admob?: any;
    AdMob?: any;
  }
}

function getAdMob() {
  return window.admob || window.AdMob || null;
}

let _initialized = false;

export function initAds() {
  if (_initialized) return;
  const admob = getAdMob();
  if (!admob) {
    setTimeout(() => { if (!_initialized) initAds(); }, 2000);
    return;
  }
  try {
    admob.start().then(() => {
      _initialized = true;
    }).catch((e: any) => {
      console.error('AdMob init failed:', e);
    });
  } catch (e) {
    console.error('AdMob init error:', e);
  }
}

export function isAdsReady() {
  return _initialized;
}

export function showBannerAd() {
  const admob = getAdMob();
  if (!admob) return;
  try {
    admob.showBanner({
      adId: ADMOB_CONFIG.banner,
      adSize: 'BANNER',
      position: 'BOTTOM_CENTER',
      margin: 0,
      isTesting: false,
    }).catch((e: any) => console.warn('Banner error:', e));
  } catch (e) {
    console.warn('Banner exception:', e);
  }
}

export function hideBannerAd() {
  const admob = getAdMob();
  if (!admob) return;
  try {
    admob.hideBanner().catch(() => {});
  } catch (_) {}
}

export function showInterstitial() {
  const admob = getAdMob();
  if (!admob) return;
  try {
    admob.prepareInterstitial({ adId: ADMOB_CONFIG.banner, isTesting: false })
      .then(() => admob.showInterstitial())
      .catch((e: any) => console.warn('Interstitial error:', e));
  } catch (e) {
    console.warn('Interstitial exception:', e);
  }
}

export function showRewarded(onGranted?: () => void) {
  const admob = getAdMob();
  if (!admob) return;
  try {
    admob.prepareRewardVideoAd({ adId: ADMOB_CONFIG.banner, isTesting: false })
      .then(() => admob.showRewardVideoAd())
      .then(() => onGranted?.())
      .catch((e: any) => console.warn('Rewarded error:', e));
  } catch (e) {
    console.warn('Rewarded exception:', e);
  }
}