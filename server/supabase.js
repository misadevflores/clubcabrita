import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://orxyjpeanhscwzajpbkw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_pjPw6lNkt6GHf-LyTQMf3w_rhsMyk85sb';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test connection
export const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count()', { count: 'exact' });
        if (error) throw error;
        console.log('✓ Supabase connection successful');
        return true;
    } catch (err) {
        console.error('✗ Supabase connection failed:', err.message);
        return false;
    }
};
