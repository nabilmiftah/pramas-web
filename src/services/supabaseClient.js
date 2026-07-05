import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgfiqnvzhikdwjnkxctd.supabase.co';
const supabaseKey = 'sb_publishable_2NwF-TweJxqmVW_D8WIL8w_PuYTCXlY';

export const supabase = createClient(supabaseUrl, supabaseKey);