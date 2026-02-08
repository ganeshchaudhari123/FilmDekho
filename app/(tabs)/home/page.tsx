'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Play, Info, Crown, TrendingUp, Star } from 'lucide-react';
import { getSeries, getCurrentUser } from '@/lib/supabase';
import { Series } from '@/types/database';
import AdsterraAds from '@/components/AdsterraAds';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HomeScreen() {
    const router = useRouter();
    const [series, setSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [trending, setTrending] = useState<Series[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (category?: string) => {
        setLoading(true);
        const { data } = await getSeries(category === 'All' ? undefined : category);
        if (data) {
            setSeries(data);
            if (!category || category === 'All') {
                setTrending(data.filter(s => s.is_trending).slice(0, 5));
            }
        }
        setLoading(false);
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        loadData(category);
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: '40px', height: '40px', border: '4px solid #FFD700', borderTopColor: 'transparent', borderRadius: '50%' }}
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}
        >
            {/* 1. Auto-Scrolling Banner Section */}
            <section style={{ width: '100%', height: '450px', position: 'relative' }}>
                <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    effect="fade"
                    style={{ width: '100%', height: '100%' }}
                >
                    {trending.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {/* Gradient Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '70%',
                                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8), #000)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '40px 20px',
                                    textAlign: 'left'
                                }}>
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <span style={{ backgroundColor: '#FFD700', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>TOP 10</span>
                                            <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1.5px' }}>WORLDWIDE TRENDING</span>
                                        </div>
                                        <h2 style={{ fontSize: '36px', fontWeight: '900', fontStyle: 'italic', marginBottom: '15px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{item.title}</h2>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button
                                                onClick={() => router.push(`/player/${item.id}`)}
                                                style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', backgroundColor: '#FFD700', color: '#000', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                                            >
                                                <Play size={20} fill="currentColor" /> PLAY
                                            </button>
                                            <button style={{ padding: '12px 25px', borderRadius: '8px', border: '1px solid #fff', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
                                                <Info size={20} /> DETAILS
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* 2. Secondary Sections */}
            <div style={{ padding: '30px 20px' }}>

                {/* Categories / Quick Filters */}
                <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '30px' }}>
                    {['All', 'Drama', 'Action', 'Romance', 'Sci-Fi'].map(cat => {
                        const isActive = (selectedCategory === 'All' && cat === 'All') || selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                style={{
                                    padding: '8px 25px',
                                    borderRadius: '20px',
                                    border: isActive ? 'none' : '1px solid #333',
                                    background: isActive ? '#FFD700' : '#111',
                                    color: isActive ? '#000' : '#888',
                                    whiteSpace: 'nowrap',
                                    fontWeight: '900',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                            >
                                {cat.toUpperCase()}
                            </button>
                        );
                    })}
                </div>

                {/* AD PLACEMENT: Horizontal Banner */}
                <AdsterraAds adKey="b8eec93e792c3a5e828d5843a9c336b1" format="728x90" />

                {/* Featured Section */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Star color="#FFD700" size={20} fill="#FFD700" /> RECENT RELEASES
                        </h3>
                        <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>See All</span>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '15px'
                    }}>
                        {series.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push(`/player/${item.id}`)}
                                style={{ position: 'relative', cursor: 'pointer' }}
                            >
                                <div style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    aspectRatio: '2/3',
                                    backgroundColor: '#111',
                                    border: '1px solid #222'
                                }}>
                                    <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                {item.is_premium && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        color: '#000',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                                    }}>
                                        VIP
                                    </div>
                                )}
                                <p style={{ marginTop: '8px', fontSize: '12px', fontWeight: 'bold', color: '#fff', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.title}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Global Footer / Credits */}
                <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #111' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '2px', color: '#333' }}>
                        FILM<span style={{ color: '#FFD700' }}>DEKHO</span> PREMIUM
                    </h4>
                </div>
            </div>
        </motion.div>
    );
}
