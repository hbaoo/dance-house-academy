
import { supabase } from './supabaseClient';
import { News } from '../types';

export const fetchNews = async (): Promise<News[]> => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const fetchPublicNews = async (): Promise<News[]> => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_visible', true)
        .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createNews = async (news: Partial<News>): Promise<News> => {
    const { data, error } = await supabase
        .from('news')
        .insert([news])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateNews = async (id: string, updates: Partial<News>): Promise<News> => {
    const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteNews = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
