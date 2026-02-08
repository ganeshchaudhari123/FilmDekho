'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
    Home,
    Crown,
    ListVideo,
    Trash2,
    PlusCircle,
    PlayCircle,
    LogOut,
    Film,
    X,
    Edit,
    ChevronLeft,
    Menu
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'series' | 'episodes' | 'vip'>('overview');
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEpisodeEditModalOpen, setIsEpisodeEditModalOpen] = useState(false);

    // Data States
    const [seriesList, setSeriesList] = useState<any[]>([]);
    const [stats, setStats] = useState({ series: 0, episodes: 0, vips: 0 });
    const [selectedSeries, setSelectedSeries] = useState<any | null>(null);
    const [episodes, setEpisodes] = useState<any[]>([]);

    // Form States
    const [seriesForm, setSeriesForm] = useState({
        title: '',
        description: '',
        poster_url: '',
        category: 'Drama',
        is_trending: false,
        is_premium: false
    });
    const [episodeForm, setEpisodeForm] = useState({
        series_id: '',
        episode_number: '',
        title: '',
        video_url: ''
    });
    const [editEpisodeForm, setEditEpisodeForm] = useState({
        id: '',
        episode_number: '',
        title: '',
        video_url: ''
    });

    useEffect(() => {
        checkAdmin();
        refreshData();
        // Auto-close sidebar on mobile
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/'); return; }

        const adminEmails = ['ganesh786chaudhari@gmail.com', 'ganeshchaudhari3077@gmail.com'];
        if (adminEmails.includes(user.email || '')) {
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase.from('users').select('user_role').eq('id', user.id).single();
        if (profile?.user_role !== 'admin') { router.push('/home'); return; }
        setLoading(false);
    };

    const refreshData = async () => {
        const { data: series } = await supabase.from('series').select('*').order('created_at', { ascending: false });
        const { count: sCount } = await supabase.from('series').select('*', { count: 'exact', head: true });
        const { count: eCount } = await supabase.from('episodes').select('*', { count: 'exact', head: true });
        const { count: vCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_vip', true);

        if (series) setSeriesList(series);
        setStats({ series: sCount || 0, episodes: eCount || 0, vips: vCount || 0 });
    };

    const handleAddSeries = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('series').insert([{
            title: seriesForm.title,
            description: seriesForm.description,
            thumbnail: seriesForm.poster_url,
            category: seriesForm.category,
            is_trending: seriesForm.is_trending,
            is_premium: seriesForm.is_premium
        }]);

        if (error) {
            toast.error('Error: ' + error.message);
        } else {
            toast.success('Series Added Successfully!');
            setSeriesForm({ title: '', description: '', poster_url: '', category: 'Drama', is_trending: false, is_premium: false });
            setIsModalOpen(false);
            refreshData();
        }
    };

    const handleDeleteSeries = async (id: string) => {
        if (!confirm('Delete this series?')) return;
        const { error } = await supabase.from('series').delete().eq('id', id);
        if (error) toast.error('Failed to delete');
        else {
            toast.success('Series Deleted');
            refreshData();
        }
    };

    const handleAddEpisode = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('episodes').insert([{
            series_id: episodeForm.series_id,
            episode_number: parseInt(episodeForm.episode_number),
            title: episodeForm.title || `Episode ${episodeForm.episode_number}`,
            video_url: episodeForm.video_url
        }]);

        if (error) toast.error('Error: ' + error.message);
        else {
            toast.success('Episode Published!');
            setEpisodeForm({ ...episodeForm, episode_number: '', title: '', video_url: '' });
            refreshData();
        }
    };

    const loadEpisodes = async (series: any) => {
        setLoading(true);
        const { data: epData } = await supabase.from('episodes').select('*').eq('series_id', series.id).order('episode_number', { ascending: true });
        if (epData) setEpisodes(epData);
        setSelectedSeries(series);
        setLoading(false);
    };

    const handleDeleteEpisode = async (id: string) => {
        if (!confirm('Delete episode?')) return;
        const { error } = await supabase.from('episodes').delete().eq('id', id);
        if (error) toast.error('Failed');
        else {
            toast.error('Deleted');
            if (selectedSeries) loadEpisodes(selectedSeries);
        }
    };

    const handleEditEpisode = (episode: any) => {
        setEditEpisodeForm({ id: episode.id, episode_number: episode.episode_number.toString(), title: episode.title, video_url: episode.video_url });
        setIsEpisodeEditModalOpen(true);
    };

    const handleUpdateEpisode = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('episodes').update({ episode_number: parseInt(editEpisodeForm.episode_number), title: editEpisodeForm.title, video_url: editEpisodeForm.video_url }).eq('id', editEpisodeForm.id);
        if (error) toast.error('Failed');
        else {
            toast.success('Updated');
            setIsEpisodeEditModalOpen(false);
            if (selectedSeries) loadEpisodes(selectedSeries);
        }
    };

    if (loading && !selectedSeries) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

            {/* Mobile Header */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: '#111', display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 100, borderBottom: '1px solid #222' }} className="md:hidden">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <Menu size={24} />
                </button>
                <span style={{ marginLeft: '15px', fontWeight: '900', color: '#FFD700' }}>ADMIN PANEL</span>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.nav
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        style={{
                            position: 'fixed', left: 0, width: '250px', height: '100vh',
                            background: '#0a0a0a', padding: '30px 20px', display: 'flex',
                            flexDirection: 'column', gap: '10px', borderRight: '1px solid #1a1a1a',
                            zIndex: 110
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ color: '#FFD700', fontSize: '20px', fontWeight: '900' }}>FILM<span style={{ color: '#fff' }}>DEKHO</span></h2>
                            <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#555' }} className="md:hidden">
                                <X size={20} />
                            </button>
                        </div>

                        <button onClick={() => { setActiveTab('overview'); setSelectedSeries(null); if (window.innerWidth < 768) setIsSidebarOpen(false); }} style={navButtonStyle(activeTab === 'overview')}>
                            <Home size={18} /> Overview
                        </button>
                        <button onClick={() => { setActiveTab('series'); setSelectedSeries(null); if (window.innerWidth < 768) setIsSidebarOpen(false); }} style={navButtonStyle(activeTab === 'series')}>
                            <ListVideo size={18} /> Manage Series
                        </button>
                        <button onClick={() => { setActiveTab('episodes'); setSelectedSeries(null); if (window.innerWidth < 768) setIsSidebarOpen(false); }} style={navButtonStyle(activeTab === 'episodes')}>
                            <Film size={18} /> Episodes
                        </button>
                        <button onClick={() => { setActiveTab('vip'); setSelectedSeries(null); if (window.innerWidth < 768) setIsSidebarOpen(false); }} style={navButtonStyle(activeTab === 'vip')}>
                            <Crown size={18} color={activeTab === 'vip' ? '#000' : '#FFD700'} /> VIP & Plans
                        </button>

                        <button onClick={() => router.push('/home')} style={{ ...navButtonStyle(false), marginTop: 'auto', color: '#ff4444' }}>
                            <LogOut size={18} /> Exit Admin
                        </button>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main style={{
                marginLeft: isSidebarOpen && window.innerWidth >= 768 ? '250px' : '0',
                padding: '40px 20px',
                paddingTop: window.innerWidth < 768 ? '100px' : '40px',
                flex: 1,
                transition: '0.3s'
            }}>

                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <AnimatePresence mode="wait">
                        {!selectedSeries ? (
                            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {activeTab === 'overview' && (
                                    <div>
                                        <h1 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: '900' }}>Dashboard Overview</h1>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                            <div style={statCardStyle}><Film color="#FFD700" size={28} /> <div><div style={{ fontSize: '32px', fontWeight: '900' }}>{stats.series}</div><div style={{ fontSize: '11px', color: '#555' }}>TOTAL SERIES</div></div></div>
                                            <div style={statCardStyle}><PlayCircle color="#FFD700" size={28} /> <div><div style={{ fontSize: '32px', fontWeight: '900' }}>{stats.episodes}</div><div style={{ fontSize: '11px', color: '#555' }}>EPISODES LIVE</div></div></div>
                                            <div style={statCardStyle}><Crown color="#FFD700" size={28} /> <div><div style={{ fontSize: '32px', fontWeight: '900' }}>{stats.vips}</div><div style={{ fontSize: '11px', color: '#555' }}>VIP ACCOUNTS</div></div></div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'series' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                                            <h1 style={{ fontSize: '28px', fontWeight: '900' }}>Content Library</h1>
                                            <button onClick={() => setIsModalOpen(true)} style={primaryButtonStyle}><PlusCircle size={20} /> ADD SERIES</button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                                            {seriesList.map(s => (
                                                <div key={s.id} style={{ background: '#111', borderRadius: '15px', overflow: 'hidden', border: '1px solid #222' }}>
                                                    <img onClick={() => loadEpisodes(s)} src={s.thumbnail} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', cursor: 'pointer' }} />
                                                    <div style={{ padding: '12px' }}>
                                                        <div style={{ fontSize: '13px', fontWeight: '900', marginBottom: '10px' }}>{s.title}</div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <span style={{ fontSize: '10px', color: '#FFD700', fontWeight: 'bold' }}>{s.category}</span>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button onClick={() => loadEpisodes(s)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><Edit size={16} /></button>
                                                                <button onClick={() => handleDeleteSeries(s.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'episodes' && (
                                    <div style={{ maxWidth: '800px' }}>
                                        <h1 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: '900' }}>Publish Episode</h1>
                                        <div style={formCardStyle}>
                                            <form onSubmit={handleAddEpisode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <div style={fieldStyle}><label>SELECT SERIES</label>
                                                    <select style={inputStyle} required value={episodeForm.series_id} onChange={e => setEpisodeForm({ ...episodeForm, series_id: e.target.value })}>
                                                        <option value="">-- Select --</option>
                                                        {seriesList.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                                    </select>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                                                    <div style={fieldStyle}><label>EP #</label><input style={inputStyle} type="number" required value={episodeForm.episode_number} onChange={e => setEpisodeForm({ ...episodeForm, episode_number: e.target.value })} /></div>
                                                    <div style={fieldStyle}><label>TITLE</label><input style={inputStyle} value={episodeForm.title} onChange={e => setEpisodeForm({ ...episodeForm, title: e.target.value })} /></div>
                                                </div>
                                                <div style={fieldStyle}><label>VIDEO URL</label><input style={inputStyle} required value={episodeForm.video_url} onChange={e => setEpisodeForm({ ...episodeForm, video_url: e.target.value })} /></div>
                                                <button type="submit" style={primaryButtonStyle}>PUBLISH NOW</button>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'vip' && <div style={{ textAlign: 'center', padding: '100px 0', color: '#333' }}>Finance Module Encrypted</div>}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                                    <button onClick={() => setSelectedSeries(null)} style={{ background: '#111', border: 'none', color: '#fff', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><ChevronLeft /></button>
                                    <h1 style={{ fontSize: '24px', fontWeight: '900' }}>{selectedSeries.title} <span style={{ color: '#555', fontSize: '14px' }}>/ episodes</span></h1>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {episodes.map(ep => (
                                        <div key={ep.id} style={{ background: '#111', padding: '15px 20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1a1a1a' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#FFD700', fontSize: '14px' }}>{ep.episode_number}</div>
                                                <div><div style={{ fontWeight: 'bold' }}>{ep.title}</div><div style={{ fontSize: '10px', color: '#444' }}>{ep.video_url.slice(0, 50)}...</div></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleEditEpisode(ep)} style={{ border: 'none', background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>EDIT</button>
                                                <button onClick={() => handleDeleteEpisode(ep.id)} style={{ border: 'none', background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>DEL</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>

            {/* Series Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={modalOverlayStyle}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={modalContentStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                                <h2 style={{ fontWeight: '900' }}>ADD NEW RELEASE</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#555' }}><X /></button>
                            </div>
                            <form onSubmit={handleAddSeries} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={fieldStyle}><label>TITLE</label><input style={inputStyle} required value={seriesForm.title} onChange={e => setSeriesForm({ ...seriesForm, title: e.target.value })} /></div>
                                <div style={fieldStyle}><label>DESCRIPTION</label><textarea style={{ ...inputStyle, height: '80px' }} required value={seriesForm.description} onChange={e => setSeriesForm({ ...seriesForm, description: e.target.value })} /></div>
                                <div style={fieldStyle}><label>POSTER URL</label><input style={inputStyle} required value={seriesForm.poster_url} onChange={e => setSeriesForm({ ...seriesForm, poster_url: e.target.value })} /></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={fieldStyle}><label>CATEGORY</label><select style={inputStyle} value={seriesForm.category} onChange={e => setSeriesForm({ ...seriesForm, category: e.target.value })}><option>Drama</option><option>Novel</option><option>Anime</option></select></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}><input type="checkbox" checked={seriesForm.is_premium} onChange={e => setSeriesForm({ ...seriesForm, is_premium: e.target.checked })} /> <span style={{ fontSize: '12px' }}>VIP</span></div>
                                </div>
                                <button type="submit" style={primaryButtonStyle}>PUBLISH SERIES</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Episode Modal */}
            <AnimatePresence>
                {isEpisodeEditModalOpen && (
                    <div style={modalOverlayStyle}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={modalContentStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                                <h2 style={{ fontWeight: '900' }}>EDIT EPISODE</h2>
                                <button onClick={() => setIsEpisodeEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#555' }}><X /></button>
                            </div>
                            <form onSubmit={handleUpdateEpisode} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={fieldStyle}><label>EP #</label><input style={inputStyle} type="number" required value={editEpisodeForm.episode_number} onChange={e => setEditEpisodeForm({ ...editEpisodeForm, episode_number: e.target.value })} /></div>
                                <div style={fieldStyle}><label>TITLE</label><input style={inputStyle} required value={editEpisodeForm.title} onChange={e => setEditEpisodeForm({ ...editEpisodeForm, title: e.target.value })} /></div>
                                <div style={fieldStyle}><label>URL</label><input style={inputStyle} required value={editEpisodeForm.video_url} onChange={e => setEditEpisodeForm({ ...editEpisodeForm, video_url: e.target.value })} /></div>
                                <button type="submit" style={primaryButtonStyle}>SAVE CHANGES</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

// Styles
const navButtonStyle = (active: boolean) => ({
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px',
    background: active ? '#FFD700' : 'transparent', color: active ? '#000' : '#888',
    border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', width: '100%',
    textAlign: 'left' as const, transition: '0.2s', fontSize: '13px'
});

const statCardStyle = { background: '#111', padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #1a1a1a' };
const formCardStyle = { background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #1a1a1a' };
const primaryButtonStyle = { background: '#FFD700', color: '#000', padding: '14px 25px', borderRadius: '10px', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' };
const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: '6px' };
const inputStyle = { background: '#000', border: '1px solid #222', color: '#fff', padding: '12px', borderRadius: '10px', outline: 'none', fontSize: '14px' };
const modalOverlayStyle: any = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' };
const modalContentStyle = { background: '#0a0a0a', padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '450px', border: '1px solid #222' };
