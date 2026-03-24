import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxamezffjphbbbswvhcw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YW1lemZmanBoYmJic3d2aGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjgwOTIsImV4cCI6MjA4ODgwNDA5Mn0.4aN_ZJv4DB9ckCxdJoHQarw0mwl_ff8WSLI1xdbRpM4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
