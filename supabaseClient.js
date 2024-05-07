import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://duvbvzjtzqdlpsoogiuk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dmJ2emp0enFkbHBzb29naXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3NDgyMTksImV4cCI6MjAzMDMyNDIxOX0.sVGftP7MGIHctrXScmMVWnBT6xeFN4aXF1lmU0C1uFU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


