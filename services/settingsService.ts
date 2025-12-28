import { supabase } from './supabaseClient';

export interface WebSettings {
    [key: string]: string;
}

/**
 * Lấy toàn bộ cài đặt từ bảng settings
 * Chuyển đổi từ dạng mảng [{key, value}] sang object {key: value}
 */
export const getWebSettings = async (): Promise<WebSettings> => {
    const { data, error } = await supabase
        .from('settings')
        .select('key, value');

    if (error) {
        console.error('Error fetching settings:', error);
        return {};
    }

    // Convert array to object
    return data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as WebSettings);
};

/**
 * Cập nhật một cài đặt cụ thể
 */
export const updateWebSetting = async (key: string, value: string) => {
    const { error } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) {
        throw error;
    }
};

/**
 * Cập nhật nhiều cài đặt cùng lúc
 */
export const updateMultipleSettings = async (settings: WebSettings) => {
    const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
        .from('settings')
        .upsert(updates);

    if (error) {
        throw error;
    }
};
