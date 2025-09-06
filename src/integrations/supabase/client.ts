import { createClient } from '@supabase/supabase-js';
// import type { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://olrieidgokcnhhymksnf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9scmllaWRnb2tjbmhoeW1rc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MTc0MjcsImV4cCI6MjA2ODM5MzQyN30.PXgv8zg4VQhTfXWKiawVz5_jWLzfl5BG1e-SDSd0IpQ";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);
