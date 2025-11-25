import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, // replace with your Supabase project URL
  import.meta.env.VITE_SUPABASE_ANON_KEY // replace with your Supabase anon key
) 


export async function saveMessage(transcript) { 
  const { data, error } = await supabase
    .from('message')
    .insert({ content: transcript })
}