import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tgfinkycmzufexncxfmk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZmlua3ljbXp1ZmV4bmN4Zm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MzQ5OTgsImV4cCI6MjEwNTMxMDk5OH0.uikS9RRCII19FCWgmObibwjLONdgrmc9yfoOqgae49E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
