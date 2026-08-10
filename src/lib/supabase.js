import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at build/dev time rather than silently breaking sync later.
  // eslint-disable-next-line no-console
  console.error(
    "Missing Supabase environment variables. Copy .env.example to .env and fill in your project URL + anon key."
  );
}

// This is the PUBLIC anon key — safe to ship in browser code by design.
// It only grants what Row Level Security policies allow (see supabase/setup.sql):
// open reads, and writes ONLY through the set_preference RPC, which validates
// each person's PIN server-side before touching any data.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: { eventsPerSecond: 5 },
  },
});
