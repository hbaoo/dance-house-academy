import { supabase } from './supabaseClient';

export interface ExpiringMembership {
    student_name: string;
    phone: string;
    package_name: string;
    end_date: string;
    days_left: number;
}

export const getExpiringMemberships = async () => {
    const { data, error } = await supabase.rpc('get_expiring_memberships');
    if (error) throw error;
    return data as ExpiringMembership[];
};

export const generateZaloLink = (phone: string, studentName: string, daysLeft: number) => {
    // Format phone: 0912... -> 84912...
    const formattedPhone = phone.replace(/^0/, '84');
    const message = `Chào ${studentName}, gói tập của bạn tại Dance House sắp hết hạn sau ${daysLeft} ngày nữa. Bạn nhớ gia hạn sớm để giữ ưu đãi nhé!`;
    return `https://zalo.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};
