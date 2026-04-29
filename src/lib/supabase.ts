import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://miftmcvznnrrfdipsszl.supabase.co'
const supabaseKey = 'sb_publishable_wW6CHNSpTPIX9kct3UCmgA__UP1FeaP'

export const supabase = createClient(supabaseUrl, supabaseKey)