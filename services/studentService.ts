import { supabase } from './supabaseClient';

export interface Student {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    birthdate?: string;
    gender?: string;
    level?: string;
    parent_name?: string;
    emergency_contact?: string;
    medical_note?: string;
    avatar_url?: string;
    join_date: string;
    status: string;
    created_at: string;
}

export const getStudents = async () => {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Student[];
};

export const getStudentById = async (id: string) => {
    const { data, error } = await supabase
        .from('students')
        .select('*, memberships(*)')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

export const createStudent = async (student: Partial<Student>) => {
    const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateStudent = async (id: string, updates: Partial<Student>) => {
    const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteStudent = async (id: string) => {
    const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const updateStudentPassword = async (studentId: string, newPassword: string): Promise<void> => {
    const { error } = await supabase.rpc('set_student_password', {
        student_id: studentId,
        new_password: newPassword
    });

    if (error) throw error;
};
