// Supabase project connection (publishable key — safe to expose client-side, RLS protects data)
const SUPABASE_URL = "https://nhneftoufvdoexmhujoj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_C7L-bo6jw5KKCpi2jjRfWg_cyB0o6dM";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
