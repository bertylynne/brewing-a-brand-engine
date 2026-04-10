import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://bjxgqbgjtzbgzdprtepd.supabase.co';
const SUPABASE_ANON = 'sb_publishable_5mY9p11tWx6znT3h2zMr2A_1J19xwEr';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
