'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Lock,
    Crown,
    Play,
    Share2,
    Heart,
    BookmarkPlus,
    BookmarkCheck,
    Pause
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { getSeriesById, getEpisodes, getCurrentUser, getUserProfile, supabase } from '@/lib/supabase';
import { Episode, Series } from '@/types/database';
import toast from 'react-hot-toast';
import AdsterraAds from '@/components/AdsterraAds';

// Swiper styles
import 'swiper/css';

export default function PlayerPage() {
    const router = useRouter();
    const params = useParams();
    const seriesId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState<Series | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [isVIP, setIsVIP] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // UI Visibility State
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        loadData();
    }, [seriesId]);

    const loadData = async () => {
        const { user } = await getCurrentUser();
        if (!user) { router.push('/'); return; }
        setUserId(user.id);

        const { data: profile } = await getUserProfile(user.id);
        setIsVIP(profile?.is_vip || false);

        const { data: seriesData } = await getSeriesById(seriesId);
        const { data: episodesData } = await getEpisodes(seriesId);

        if (seriesData) setSeries(seriesData);
        if (episodesData) setEpisodes(episodesData);

        // Check if bookmarked
        const { data: bookmark } = await supabase
            .from('my_list')
            .select('*')
            .eq('user_id', user.id)
            .eq('series_id', seriesId)
            .single();

        if (bookmark) setBookmarked(true);

        setLoading(false);
    };

    const toggleBookmark = async () => {
        if (!userId) return;

        if (bookmarked) {
            const { error } = await supabase
                .from('my_list')
                .delete()
                .eq('user_id', userId)
                .eq('series_id', seriesId);

            if (!error) {
                setBookmarked(false);
                toast.success('Removed from My List');
            }
        } else {
            const { error } = await supabase
                .from('my_list')
                .insert([{ user_id: userId, series_id: seriesId }]);

            if (!error) {
                setBookmarked(true);
                toast.success('Added to My List');
            } else {
                toast.error(error.message);
            }
        }
    };

    if (loading) return (
        <div style={{ height: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="shimmer-container">
                <div style={{ width: '200px', height: '300px', backgroundColor: '#111', borderRadius: '15px', position: 'relative', overflow: 'hidden' }}>
                    <div className="shimmer" />
                </div>
            </div>
            <style jsx>{`
                .shimmer {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, #111 25%, #222 50%, #111 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite linear;
                }
                @keyframes shimmer {
                    from { background-position: 200% 0; }
                    to { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );

    return (
        <div style={{ height: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>

            {/* 1. Global Blurred Poster Background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: `url(${series?.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(60px) brightness(0.15)',
                transform: 'scale(1.15)',
                zIndex: 0
            }} />

            {/* 2. App Container (Centered Mobile Frame) */}
            <div className="app-container" style={{ position: 'relative', zIndex: 1, boxShadow: 'none', pointerEvents: 'none' }}>

                {/* Header (Stay Clickable) */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
                    padding: '25px', display: 'flex', alignItems: 'center', gap: '15px',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
                }}>
                    <button onClick={() => router.back()} style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '10px', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                        <ArrowLeft size={24} />
                    </button>
                    {isVIP && (
                        <div style={{ marginLeft: 'auto', background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', padding: '4px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: '900' }}>
                            PRO MEMBER
                        </div>
                    )}
                </div>

                {episodes.length > 0 ? (
                    <Swiper
                        direction="vertical"
                        slidesPerView={1}
                        mousewheel={true}
                        modules={[Mousewheel]}
                        style={{ height: '100vh', width: '100%', zIndex: 0, pointerEvents: 'auto' }}
                    >
                        {episodes.map((episode) => {
                            const locked = episode.episode_number >= 5 && !isVIP;
                            return (
                                <SwiperSlide key={episode.id} style={{ position: 'relative', backgroundColor: 'transparent' }}>

                                    {/* VIDEO LAYER - Bottommost Layer (Z-Index 0) */}
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', position: 'relative', zIndex: 0 }}>
                                        {locked ? (
                                            <div style={{
                                                position: 'absolute', inset: 0, zIndex: 50,
                                                backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex',
                                                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                padding: '40px', textAlign: 'center', pointerEvents: 'auto'
                                            }}>
                                                <div style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                                                    <Lock size={48} color="#FFD700" />
                                                </div>
                                                <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px', color: '#FFD700' }}>VIP EXCLUSIVE</h3>
                                                <button
                                                    onClick={() => router.push('/vip')}
                                                    style={{ backgroundColor: '#FFD700', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '50px', fontWeight: '900', cursor: 'pointer' }}>
                                                    JOIN VIP NOW
                                                </button>
                                            </div>
                                        ) : (
                                            <iframe
                                                src={`${episode.video_url}${episode.video_url.includes('?') ? '&' : '?'}autoplay=1&mute=0`}
                                                style={{ width: '100%', height: '100%', border: 'none', position: 'relative', zIndex: 0 }}
                                                allowFullScreen
                                            />
                                        )}
                                    </div>

                                    {/* CONTROLS OVERLAY - Pass Through Enabled (pointer-events-none) */}
                                    <div style={{
                                        position: 'absolute', inset: 0, zIndex: 20,
                                        pointerEvents: 'none', // ENSURES VIDEO PLAY BUTTON IS ACCESSIBLE
                                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                                    }}>

                                        {/* RIGHT SIDEBAR (Re-enable clicks with pointer-events-auto) */}
                                        <div style={{
                                            position: 'absolute', right: '15px', bottom: '33%',
                                            display: 'flex', flexDirection: 'column', gap: '22px',
                                            pointerEvents: 'auto', zIndex: 30
                                        }}>
                                            <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <Heart size={26} fill={liked ? "#ff0000" : "none"} color={liked ? "#ff0000" : "#fff"} />
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>24.1K</span>
                                            </button>

                                            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    {bookmarked ? (
                                                        <BookmarkCheck size={26} color="#FFD700" fill="#FFD700" />
                                                    ) : (
                                                        <BookmarkPlus size={26} color="#fff" />
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{bookmarked ? 'Saved' : 'Save'}</span>
                                            </button>

                                            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <Share2 size={26} />
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Share</span>
                                            </button>
                                        </div>

                                        {/* BOTTOM INFOBAR (Re-enable clicks with pointer-events-auto) */}
                                        <div style={{
                                            padding: '20px 20px 40px 20px',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
                                            pointerEvents: 'auto',
                                            zIndex: 30
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                <span style={{ backgroundColor: '#FFD700', color: '#000', padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '900' }}>EP {episode.episode_number}</span>
                                                <span style={{ color: '#FFD700', fontSize: '11px', fontWeight: 'bold' }}>• FILMDEKHO PREMIUM</span>
                                            </div>
                                            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '5px' }}>{series?.title?.toUpperCase()}</h1>
                                            <p style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '85%' }}>
                                                {series?.description}
                                            </p>

                                            {/* Adsterra (Clickable) */}
                                            <div style={{ marginTop: '15px', transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                                                <AdsterraAds adKey="e13197609204af5832f5d3a9c336b1d1" format="300x250" />
                                            </div>
                                        </div>
                                    </div>

                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>NO EPISODES FOUND</div>
                )}
            </div>
        </div>
    );
}
