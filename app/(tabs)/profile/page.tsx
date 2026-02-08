'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, signOut } from '@/lib/supabase';

export default function ProfilePage() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const { user } = await getCurrentUser();
        if (!user) { router.push('/'); return; }
        setUserEmail(user.email || '');
        setLoading(false);
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div style={{ flex: 1, paddingBottom: '100px' }}>
            <header style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#1A1A1A',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    border: '1px solid #333'
                }}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '900' }}>{userEmail}</h2>
                <p style={{ color: '#FFD700', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginTop: '5px' }}>Free Member</p>
            </header>

            <div style={{ padding: '0 20px' }}>
                <div style={{ backgroundColor: '#1A1A1A', padding: '10px', borderRadius: '15px', border: '1px solid #333' }}>
                    <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>VIP Status</span>
                        <span style={{ fontSize: '14px', color: '#777' }}>Inactive</span>
                    </div>
                    <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Account Safety</span>
                        <span style={{ fontSize: '14px', color: '#4CAF50' }}>Verified</span>
                    </div>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="btn-gold" onClick={() => router.push('/vip')}>UPGRADE TO VIP</button>
                    <button
                        className="btn-secondary"
                        onClick={handleLogout}
                        style={{ color: '#ff4444', borderColor: '#ff4444' }}
                    >LOGOUT</button>
                </div>
            </div>

        </div>
    );
}
