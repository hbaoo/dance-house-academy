
import { createClient, SupabaseClient } from '@supabase/supabase-js';



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | undefined;

try {
    if (supabaseUrl && supabaseAnonKey) {
        client = createClient(supabaseUrl, supabaseAnonKey);
    } else {
        console.warn("Supabase credentials missing! Fallback strategies might be needed.");
    }
} catch (error) {
    console.error("Failed to initialize Supabase client:", error);
}

// Export safe fallback
export const supabase = client || ({} as SupabaseClient);

// Export helper to check if real client exists
export const isSupabaseReady = (): boolean => !!client;
