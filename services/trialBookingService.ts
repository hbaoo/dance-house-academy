import { supabase } from './supabaseClient';

export interface TrialBooking {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
    class_interest?: string;
    note?: string;
    status: 'Pending' | 'Contacted' | 'Converted' | 'Cancelled';
    created_at: string;
}

export const createTrialBooking = async (booking: Partial<TrialBooking>) => {
    const { data, error } = await supabase
        .from('trial_bookings')
        .insert([booking])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getTrialBookings = async () => {
    const { data, error } = await supabase
        .from('trial_bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TrialBooking[];
};

export const updateTrialStatus = async (id: string, status: string) => {
    const { error } = await supabase
        .from('trial_bookings')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};
