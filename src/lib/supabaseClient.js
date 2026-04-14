import { createClient } from '@supabase/supabase-js';

// Auth options disabled so this client never fires automatic token-refresh
// or session-restore requests on page load — those were the source of the
// phantom background requests seen in the Newsroom.
export const supabase = createClient(
  'https://bjxgqbgjtzbgzdprtepd.supabase.co',
  'sb_publishable_5mY9p11tWx6znT3h2zMr2A_1J19xwEr',
  {
    auth: {
      persistSession:     false,
      autoRefreshToken:   false,
      detectSessionInUrl: false,
    },
  }
);
