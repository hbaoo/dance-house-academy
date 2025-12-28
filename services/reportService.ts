import { supabase } from './supabaseClient';

export interface MonthlyRevenue {
    month: number;
    year: number;
    total_revenue: number;
    transaction_count: number;
}

export const getMonthlyRevenue = async () => {
    const { data, error } = await supabase.rpc('get_monthly_revenue');
    if (error) throw error;
    // Sort chronological: Oldest first for the chart
    return (data as MonthlyRevenue[]).reverse();
};
