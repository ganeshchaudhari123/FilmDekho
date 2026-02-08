'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Film, Play, Search, Trash2 } from 'lucide-react';
import { getCurrentUser, supabase } from '@/lib/supabase';
import SeriesCard from '@/components/SeriesCard';
import { Series } from '@/types/database';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyListPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [savedSeries, setSavedSeries] = useState<Series[]>([]);

    useEffect(() => {
        loadMyList();
    }, []);

    const loadMyList = async () => {
        setLoading(true);
        const { user } = await getCurrentUser();
        if (!user) {
            router.push('/');
            return;
        }

        // Fetch saved series IDs from my_list table
        const { data: listData, error: listError } = await supabase
            .from('my_list')
            .select('series_id')
            .eq('user_id', user.id);

        if (listError) {
            console.error('Error fetching list:', listError);
            setLoading(false);
            return;
        }

        if (listData && listData.length > 0) {
            const seriesIds = listData.map(item => item.series_id);

            // Fetch actual series details for these IDs
            const { data: seriesData, error: seriesError } = await supabase
                .from('series')
                .select('*')
                .in('id', seriesIds);

            if (seriesError) {
                console.error('Error fetching series details:', seriesError);
            } else if (seriesData) {
                setSavedSeries(seriesData);
            }
        } else {
            setSavedSeries([]);
        }

        setLoading(false);
    };

    if (loading) return (
        <div style={{ height: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid #FFD700', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', paddingBottom: '100px' }}>
            <header style={{ padding: '40px 25px', paddingTop: '60px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-1px' }}>
                    MY <span style={{ color: '#FFD700' }}>LIST</span>
                </h1>
                <p style={{ color: '#555', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '5px' }}>
                    {savedSeries.length} Productions Saved
                </p>
            </header>

            <div style={{ padding: '0 25px' }}>
                {savedSeries.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '15px'
                    }}>
                        {savedSeries.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SeriesCard series={item} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        marginTop: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: '#111',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #222'
                        }}>
                            <Bookmark size={40} color="#333" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>YOUR LIST IS EMPTY</h3>
                            <p style={{ color: '#666', fontSize: '13px', marginTop: '10px', lineHeight: '1.6' }}>
                                Start saving your favorite dramas<br />to watch them later!
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/home')}
                            style={{
                                background: '#FFD700',
                                color: '#000',
                                border: 'none',
                                padding: '15px 40px',
                                borderRadius: '50px',
                                fontWeight: '900',
                                cursor: 'pointer',
                                marginTop: '20px',
                                boxShadow: '0 10px 20px rgba(255, 215, 0, 0.2)'
                            }}
                        >
                            EXPLORE DRAMAS
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
