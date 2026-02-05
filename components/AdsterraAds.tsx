'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface AdsterraAdsProps {
    adKey: string;
    format: '300x250' | '728x90' | '468x60' | '160x600';
}

/**
 * Reusable Adsterra Banner Component
 * Handles script placement and Ad-Blocker detection
 */
export default function AdsterraAds({ adKey, format }: AdsterraAdsProps) {
    const bannerRef = useRef<HTMLDivElement>(null);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        // Detect Ad-Blocker
        const adBlockCheck = setTimeout(() => {
            if (bannerRef.current && bannerRef.current.offsetHeight === 0) {
                console.error(`[Adsterra Error]: Ad script was blocked for key: ${adKey}`);
                setIsBlocked(true);
            }
        }, 5000);

        // Inject Adsterra Config and Script
        if (bannerRef.current && !bannerRef.current.querySelector('script')) {
            const configScript = document.createElement('script');
            const invokeScript = document.createElement('script');

            configScript.type = 'text/javascript';
            configScript.innerHTML = `
                atOptions = {
                    'key' : '${adKey}',
                    'format' : 'iframe',
                    'height' : ${format.split('x')[1]},
                    'width' : ${format.split('x')[0]},
                    'params' : {}
                };
            `;

            invokeScript.type = 'text/javascript';
            invokeScript.src = `//www.profitabledisplaynetwork.com/${adKey}/invoke.js`;
            invokeScript.async = true;

            bannerRef.current.appendChild(configScript);
            bannerRef.current.appendChild(invokeScript);
        }

        return () => clearTimeout(adBlockCheck);
    }, [adKey, format]);

    return (
        <div className="w-full flex flex-col items-center my-6 gap-2">
            <div
                ref={bannerRef}
                id={`ad-slot-${adKey}`}
                className="adsterra-banner-container bg-surface-dark border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                    minHeight: `${format.split('x')[1]}px`,
                    width: '100%',
                    maxWidth: `${format.split('x')[0]}px`
                }}
            >
                {!isBlocked && (
                    <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest absolute">
                        Sponsored Content Loading...
                    </span>
                )}
            </div>

            {isBlocked && (
                <p className="text-[9px] text-accent-gold/50 font-bold uppercase">
                    Please disable ad-blocker for better experience
                </p>
            )}
        </div>
    );
}
