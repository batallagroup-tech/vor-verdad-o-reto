import { useEffect, useRef } from 'react';
import { initAds, showBannerAd, isAdsReady } from '../services/ads';

export default function AdMobBanner() {
  const triedRef = useRef(false);

  useEffect(() => {
    initAds();
    if (triedRef.current) return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (isAdsReady()) {
        clearInterval(interval);
        if (!triedRef.current) {
          triedRef.current = true;
          try { showBannerAd(); } catch (_) {}
        }
      }
      if (attempts >= 5) clearInterval(interval);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
