import { supabase } from './supabaseClient';
import { deductSession } from './membershipService';

export interface Attendance {
    id: string;
    student_id: string;
    class_id: number;
    date: string;
    check_in_time: string;
    status: string;
    created_at: string;
}

export const getAttendanceByClass = async (classId: number, date?: string) => {
    let query = supabase
        .from('attendance')
        .select('*')
        .eq('class_id', classId);

    if (date) {
        query = query.eq('date', date);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as Attendance[];
};

export const getAttendanceByStudent = async (studentId: string) => {
    const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

    if (error) throw error;
    return data as Attendance[];
};

export const createAttendance = async (attendance: Partial<Attendance>) => {
    const { data, error } = await supabase
        .from('attendance')
        .insert([attendance])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const checkInStudent = async (
    studentId: string,
    classId: number,
    membershipId?: string
) => {
    // Create attendance record
    const attendance = await createAttendance({
        student_id: studentId,
        class_id: classId,
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });

    // Deduct session if membership provided
    if (membershipId) {
        await deductSession(membershipId);
    }

    return attendance;
};

export const updateAttendance = async (id: string, updates: Partial<Attendance>) => {
    const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};
