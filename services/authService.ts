import { supabase } from './supabaseClient';
import { Session, User } from '@supabase/supabase-js';

/**
 * Sign in using email and password via Supabase Auth.
 * Returns the session if successful, otherwise null.
 */
export const signIn = async (email: string, password: string): Promise<Session | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error('Supabase signIn error:', error.message);
        return null;
    }
    return data.session;
};

/**
 * Sign out the current user.
 */
export const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Supabase signOut error:', error.message);
};

/**
 * Get the current authenticated user (if any).
 */
export const getUser = async (): Promise<User | null> => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Supabase getUser error:', error.message);
        return null;
    }
    return data.user;
};

/**
 * Helper to check if a user is authenticated (used by RequireAuth).
 */
export const isAuthenticated = async (): Promise<boolean> => {
    const user = await getUser();
    return !!user;
};
