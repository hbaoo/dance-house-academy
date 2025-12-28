
import { supabase } from './supabaseClient';
import { Transaction, Student, Membership } from '../types';

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }

    return data || [];
};

export const updateTransactionStatus = async (id: string, status: 'completed' | 'cancelled'): Promise<void> => {
    const { error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};

/**
 * Auto-enroll functionality:
 * 1. Find or create student based on phone number.
 * 2. Create membership for the student based on the transaction package.
 */
export const enrollStudentFromTransaction = async (transaction: Transaction) => {
    try {
        // 1. Check if student exists
        let studentId = transaction.student_id;

        if (!studentId) {
            const { data: existingStudent } = await supabase
                .from('students')
                .select('id')
                .eq('phone', transaction.customer_phone)
                .single();

            if (existingStudent) {
                studentId = existingStudent.id;
            } else {
                // Create new student
                const { data: newStudent, error: createError } = await supabase
                    .from('students')
                    .insert([{
                        full_name: transaction.customer_name,
                        phone: transaction.customer_phone,
                        email: transaction.customer_email,
                        status: 'Active',
                        join_date: new Date().toISOString()
                    }])
                    .select('id')
                    .single();

                if (createError) throw createError;
                studentId = newStudent.id;
            }

            // Update transaction with student_id
            await supabase
                .from('transactions')
                .update({ student_id: studentId })
                .eq('id', transaction.id);
        }

        // 2. Create Membership
        // We need package details to calculate sessions/end_date
        // Assuming metadata has package_name, or we fetch package. 
        // For simplicity, let's fetch the package info or derive it.
        // Ideally, we should fetch the package data.
        let totalSessions = 8; // Default
        let durationDays = 30;
        let packageName = transaction.metadata?.package_name || 'Gói học phí';

        if (transaction.package_id) {
            const { data: pkg } = await supabase
                .from('packages')
                .select('*')
                .eq('id', transaction.package_id)
                .single();

            if (pkg) {
                totalSessions = pkg.total_sessions;
                durationDays = pkg.duration_days || 36500; // unlimited logic
                packageName = pkg.name;
            }
        }

        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

        const { error: membershipError } = await supabase
            .from('memberships')
            .insert([{
                student_id: studentId,
                package_name: packageName,
                total_sessions: totalSessions,
                remaining_sessions: totalSessions,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: 'Active'
            }]);

        if (membershipError) throw membershipError;

        return { success: true, studentId };

    } catch (error) {
        console.error("Auto-enrollment failed:", error);
        throw error;
    }
};
