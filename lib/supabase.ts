import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
};

// Database queries
export const getUserProfile = async (userId: string) => {
    // Corrected back to 'users' table as per schema.sql
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
};

export const getSeries = async (category?: string, trending?: boolean) => {
    let query = supabase.from('series').select('*');

    if (category) {
        query = query.eq('category', category);
    }

    if (trending) {
        query = query.eq('is_trending', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
};

export const getSeriesById = async (seriesId: string) => {
    const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('id', seriesId)
        .single();
    return { data, error };
};

export const getEpisodes = async (seriesId: string) => {
    const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('series_id', seriesId)
        .order('episode_number', { ascending: true });
    return { data, error };
};

export const getVIPPlans = async () => {
    const { data, error } = await supabase
        .from('vip_plans')
        .select('*')
        .order('price', { ascending: true });
    return { data, error };
};

export const addSeries = async (series: { title: string, description: string, thumbnail: string, category: string }) => {
    const { data, error } = await supabase
        .from('series')
        .insert([series])
        .select();
    return { data, error };
};

export const addEpisode = async (episode: { series_id: string, episode_number: number, title: string, video_url: string }) => {
    const { data, error } = await supabase
        .from('episodes')
        .insert([episode])
        .select();
    return { data, error };
};
