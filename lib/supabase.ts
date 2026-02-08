import { createClient } from '@supabase/supabase-js';

const isProduction = process.env.NODE_ENV === 'production';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safety check for initialization
if (!supabaseUrl || !supabaseAnonKey) {
    if (isProduction) {
        console.warn('CRITICAL: Supabase keys missing in production build.');
    } else {
        throw new Error('Supabase URL or Anon Key is missing. Check your .env link.');
    }
}

// In production, if keys are missing, we still need to provide strings to avoid crash
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Auth helpers
export const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    } catch (err: any) {
        return { data: { user: null }, error: { message: err.message || 'Failed to fetch auth' } };
    }
};

export const signUp = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    } catch (err: any) {
        return { data: { user: null }, error: { message: err.message || 'Failed to fetch auth' } };
    }
};

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        return { error };
    } catch (err: any) {
        return { error: { message: err.message || 'Failed to fetch signout' } };
    }
};

export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    } catch (err: any) {
        return { user: null, error: { message: err.message || 'Failed to fetch user' } };
    }
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
