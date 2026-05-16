import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-3849768825456219~7335875202',
  banner: 'ca-app-pub-3849768825456219/9269956715',
};

let _initialized = false;

export async function initAds() {
  if (_initialized) return;
  try {
    await AdMob.initialize({ testingDevices: [], initializeForTesting: false });
    _initialized = true;
  } catch (e) {
    console.warn('AdMob init error:', e);
  }
}

export function isAdsReady() { return _initialized; }

export async function showBannerAd() {
  if (!_initialized) return;
  try {
    await AdMob.showBanner({
      adId: ADMOB_CONFIG.banner,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false,
    });
  } catch (e) {
    console.warn('Banner error:', e);
  }
}

export async function hideBannerAd() {
  try { await AdMob.hideBanner(); } catch (_) {}
}

export function showInterstitial() {}
export function showRewarded(_onGranted?: () => void) {}
