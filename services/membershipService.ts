import { supabase } from './supabaseClient';

export interface Membership {
    id: string;
    student_id: string;
    package_name: string;
    total_sessions: number;
    remaining_sessions: number;
    start_date: string;
    end_date?: string;
    status: string;
    created_at: string;
}

export const getMemberships = async (studentId?: string) => {
    let query = supabase.from('memberships').select('*');
    if (studentId) {
        query = query.eq('student_id', studentId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as Membership[];
};

export const createMembership = async (membership: Partial<Membership>) => {
    const { data, error } = await supabase
        .from('memberships')
        .insert([membership])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateMembership = async (id: string, updates: Partial<Membership>) => {
    const { data, error } = await supabase
        .from('memberships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deductSession = async (membershipId: string) => {
    const { data: membership, error: fetchError } = await supabase
        .from('memberships')
        .select('remaining_sessions')
        .eq('id', membershipId)
        .single();

    if (fetchError) throw fetchError;
    if (membership.remaining_sessions <= 0) throw new Error('No sessions remaining');

    const { data, error } = await supabase
        .from('memberships')
        .update({ remaining_sessions: membership.remaining_sessions - 1 })
        .eq('id', membershipId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
