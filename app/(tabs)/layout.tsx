'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Crown, ListVideo, User } from 'lucide-react';

export default function TabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { name: 'HOME', path: '/home', icon: <Home size={24} /> },
        { name: 'VIP', path: '/vip', icon: <Crown size={24} color={pathname === '/vip' ? '#000' : '#FFD700'} /> },
        { name: 'LIST', path: '/my-list', icon: <ListVideo size={24} /> },
        { name: 'ME', path: '/profile', icon: <User size={24} /> },
    ];

    return (
        <div className="app-container">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
                <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }}>
                    {children}
                </main>

                {/* Persistent Bottom Navigation */}
                <nav style={{
                    position: 'fixed',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '480px',
                    height: '80px',
                    background: 'rgba(17, 17, 17, 0.95)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderTop: '1px solid #222',
                    zIndex: 1000,
                    paddingBottom: 'env(safe-area-inset-bottom)'
                }}>
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path;
                        return (
                            <Link
                                key={tab.path}
                                href={tab.path}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '5px',
                                    textDecoration: 'none',
                                    color: isActive ? '#FFD700' : '#888',
                                    transition: '0.3s',
                                    padding: '10px'
                                }}
                            >
                                <div style={{
                                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                                    transition: '0.2s',
                                    color: isActive ? '#FFD700' : 'inherit'
                                }}>
                                    {tab.icon}
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>{tab.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
