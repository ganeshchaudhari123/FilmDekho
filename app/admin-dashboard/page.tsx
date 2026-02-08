'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Film,
    Users,
    Crown,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    LogOut,
    Eye,
    Settings,
    TrendingUp
} from 'lucide-react';
import { getCurrentUser, getUserProfile, signOut, getSeries } from '@/lib/supabase';
import { Series } from '@/types/database';

type TabType = 'overview' | 'series' | 'users' | 'vip';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState<Series[]>([]);

    useEffect(() => {
        checkAdminAccess();
        loadData();
    }, []);

    const checkAdminAccess = async () => {
        const { user } = await getCurrentUser();
        if (!user) { router.push('/'); return; }
        const { data: profile } = await getUserProfile(user.id);
        if (profile?.user_role !== 'admin') { router.push('/home'); return; }
        setLoading(false);
    };

    const loadData = async () => {
        const { data } = await getSeries();
        if (data) setSeries(data);
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    if (loading) return (
        <div className="h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black flex text-white font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-surface-dark border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-accent-gold p-2 rounded-lg">
                        <LayoutDashboard className="text-black" size={24} />
                    </div>
                    <h1 className="text-xl font-black italic tracking-tighter">FILM<span className="text-accent-gold">PANEL</span></h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'series', icon: Film, label: 'Content Management' },
                        { id: 'users', icon: Users, label: 'User Control' },
                        { id: 'vip', icon: Crown, label: 'Finance & VIP' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabType)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-accent-gold text-black shadow-lg shadow-yellow-500/10' : 'text-gray-400 hover:bg-white/5'}`}
                        >
                            <item.icon size={20} />
                            <span className="text-xs uppercase tracking-widest leading-none">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <button onClick={() => router.push('/home')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-gray-400 hover:text-white transition-all">
                        <ArrowLeft size={18} />
                        <span className="text-[10px] uppercase font-black">EXIT DASHBOARD</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all">
                        <LogOut size={18} />
                        <span className="text-[10px] uppercase font-black">POWER OFF</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.02),transparent)]">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">System <span className="text-accent-gold">{activeTab}</span></h2>
                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-1">Operational Status: All Systems Go</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                            <Settings size={20} className="text-gray-400" />
                        </button>
                        <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">LIVE SYNC</span>
                        </div>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                            <TrendingUp size={32} className="text-accent-gold mb-4" />
                            <h4 className="text-5xl font-black tracking-tighter">{series.length}</h4>
                            <p className="text-gray-500 text-xs font-black uppercase mt-2">ACTIVE PRODUCTIONS</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                            <Users size={32} className="text-accent-gold mb-4" />
                            <h4 className="text-5xl font-black tracking-tighter">12</h4>
                            <p className="text-gray-500 text-xs font-black uppercase mt-2">TOTAL MEMBERS</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                            <Crown size={32} className="text-accent-gold mb-4" />
                            <h4 className="text-5xl font-black tracking-tighter">3</h4>
                            <p className="text-gray-500 text-xs font-black uppercase mt-2">VIP OPERATIONS</p>
                        </div>
                    </div>
                )}

                {activeTab === 'series' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5 mb-8">
                            <p className="text-sm font-bold text-gray-400">Total of {series.length} series found in database.</p>
                            <button className="bg-gold-gradient text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-yellow-500/10">
                                <Plus size={16} /> ADD NEW RELEASE
                            </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {series.map((item) => (
                                <div key={item.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-all overflow-hidden group">
                                    <div className="w-20 h-28 rounded-xl overflow-hidden shadow-2xl shrink-0">
                                        <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-lg font-black italic uppercase tracking-tight truncate">{item.title}</h5>
                                        <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-md text-[9px] font-black tracking-tighter uppercase">{item.category}</span>
                                            {item.is_trending && <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-md text-[9px] font-black tracking-tighter uppercase">TRENDING</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Edit size={16} /></button>
                                        <button className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(activeTab === 'users' || activeTab === 'vip') && (
                    <div className="bg-white/5 p-20 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
                        <Settings size={48} className="text-gray-700 mb-6 animate-spin" style={{ animationDuration: '4s' }} />
                        <h3 className="text-xl font-black italic tracking-tight uppercase">SYSTEM MODULE OFFLINE</h3>
                        <p className="text-gray-500 text-sm mt-2">This control node is currently being calibrated. <br /> Access will be restored in the next update.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
