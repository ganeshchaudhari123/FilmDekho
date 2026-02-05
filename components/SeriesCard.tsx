'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Crown, Play } from 'lucide-react';
import { Series } from '@/types/database';

interface SeriesCardProps {
    series: Series;
}

export default function SeriesCard({ series }: SeriesCardProps) {
    return (
        <Link href={`/player/${series.id}`} className="group relative block aspect-[2/3] w-full bg-surface-dark rounded-xl overflow-hidden border border-white/5 transition-all active:scale-95">
            {/* Thumbnail */}
            <img
                src={series.thumbnail || '/placeholder-poster.jpg'}
                alt={series.title}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />

            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                {series.is_premium && (
                    <div className="bg-accent-gold text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-lg">
                        <Crown size={8} /> VIP
                    </div>
                )}
                {series.dubbed && (
                    <div className="bg-accent-red text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm shadow-lg">
                        DUB
                    </div>
                )}
            </div>

            {/* Gradient Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

            {/* Title & Floating Play */}
            <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-[10px] font-bold text-white line-clamp-1 leading-tight mb-1">{series.title}</h4>
            </div>

            {/* Center Play Icon Hidden by default */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-accent-gold/90 w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/40">
                    <Play fill="black" size={16} className="ml-1" />
                </div>
            </div>
        </Link>
    );
}
