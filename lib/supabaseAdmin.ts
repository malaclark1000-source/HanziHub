// Server-only Supabase client using the service role key.
// This key bypasses Row Level Security entirely — never import this file
// from client ('use client') code, and never call it without first checking
// getVerifiedAdminEmail/getVerifiedUser from lib/serverAuth.ts.
import { createClient } from '@supabase/supabase-js'

export function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
