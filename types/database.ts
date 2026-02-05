export interface User {
    id: string;
    email: string;
    user_role: 'user' | 'admin';
    is_vip: boolean;
    vip_expiry?: string;
    created_at: string;
}

export interface Series {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    category: 'Drama' | 'Novel' | 'Anime';
    is_trending: boolean;
    is_premium: boolean;
    dubbed: boolean;
    created_at: string;
}

export interface Episode {
    id: string;
    series_id: string;
    episode_number: number;
    title: string;
    video_url: string;
    thumbnail: string;
    duration: number;
    is_locked: boolean;
    created_at: string;
}

export interface VIPPlan {
    id: string;
    name: string;
    duration_days: number;
    price: number;
    features: string[];
    is_popular: boolean;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
}
