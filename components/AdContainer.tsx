'use client';

import { useEffect, useState } from 'react';

interface AdContainerProps {
    className?: string;
}

export default function AdContainer({ className = "" }: AdContainerProps) {
    return (
        <div className={`w-full min-h-[100px] bg-white/[0.03] border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em] overflow-hidden ${className}`}>
            {/* Adsterra Script Placement */}
            <div
                dangerouslySetInnerHTML={{
                    __html: `<!-- Adsterra Slot Placeholder -->
                   <div id="adsterra-banner"></div>`
                }}
            />
            <span>Ad Promotion Area</span>
        </div>
    );
}
