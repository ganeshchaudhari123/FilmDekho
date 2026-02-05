'use client';

import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
    type: 'native-banner' | 'social-bar';
    className?: string;
}

export default function AdsterraAd({ type, className = '' }: AdsterraAdProps) {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!adContainerRef.current) return;

        // Clear any existing ads
        adContainerRef.current.innerHTML = '';

        // Create script element
        const script = document.createElement('script');
        script.async = true;

        if (type === 'native-banner') {
            script.setAttribute('data-cfasync', 'false');
            script.src = `//www.topcreativeformat.com/${process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_ID}/invoke.js`;
        } else if (type === 'social-bar') {
            script.setAttribute('data-cfasync', 'false');
            script.src = `//www.topcreativeformat.com/${process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ID}/invoke.js`;
        }

        // Append script to container
        adContainerRef.current.appendChild(script);

        // Cleanup
        return () => {
            if (adContainerRef.current) {
                adContainerRef.current.innerHTML = '';
            }
        };
    }, [type]);

    return (
        <div
            ref={adContainerRef}
            className={`adsterra-ad ${type} ${className}`}
            style={{ minHeight: type === 'native-banner' ? '250px' : '60px' }}
        />
    );
}
