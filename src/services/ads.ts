export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-3849768825456219~7335875202',
  banner: 'ca-app-pub-3849768825456219/9269956715',
};

let _initialized = false;

export function initAds() { _initialized = true; }
export function isAdsReady() { return _initialized; }
export function showBannerAd() {}
export function hideBannerAd() {}
export function showInterstitial() {}
export function showRewarded(_onGranted?: () => void) {}
