import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://najyetpmxjqgjrppuytn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hanlldHBteGphZ2pycHB1eXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDQwMTgsImV4cCI6MjA4OTkyMDAxOH0.u8mQKSS1EobsXwZKMcXXbSb11T1p3aLKMcbmSqBHEuQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
