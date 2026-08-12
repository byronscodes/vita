import { createBrowserClient } from '@supabase/ssr'

// Creates Supabase client for browser usage
// Used in client components and hooks
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}