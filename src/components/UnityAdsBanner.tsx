import React, { useEffect, useRef, useState } from 'react';
import { getPlatformConfig, getUnityAds, isAdsReady, showBannerAd } from '../services/ads';

export default function UnityAdsBanner() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const triedRef = useRef(false);

  useEffect(() => {
    if (triedRef.current) return;

    // Poll until ads SDK is initialized (max ~10s)
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (isAdsReady()) {
        clearInterval(interval);
        if (!triedRef.current) {
          triedRef.current = true;
          setStatus('loading');
          const config = getPlatformConfig();
          const ads = getUnityAds();
          if (!ads) { setStatus('error'); return; }
          try {
            ads.load(config.banner, {
              onComplete: (id: string) => {
                try { ads.show(id); setStatus('ready'); } catch (_) { setStatus('error'); }
              },
              onFailed: (_id: string, err: any, msg: string) => {
                console.warn('Banner failed:', err, msg);
                setStatus('error');
              },
            });
          } catch (e) {
            console.warn('Banner exception:', e);
            setStatus('error');
          }
        }
      }
      if (attempts >= 5) clearInterval(interval); // give up after 10s
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mb-4 px-2">
      <div className="w-full h-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
        <div className="flex items-center gap-2 z-10">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'ready' ? 'bg-green-500' : status === 'error' ? 'bg-red-500/50' : 'bg-pink-500/50'}`} />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            {status === 'ready' ? 'Anuncio activo' : 'Publicidad'}
          </span>
        </div>
        <div className="absolute top-1.5 right-2 px-1.5 py-0.5 bg-white/5 rounded text-[7px] font-bold text-white/30 border border-white/5">
          AD
        </div>
      </div>
    </div>
  );
}
