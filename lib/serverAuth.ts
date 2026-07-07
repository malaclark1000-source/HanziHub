// Server-only helpers for verifying who is calling an API route.
// Never trust an email/id sent in a request body — always verify the
// Supabase access token and read the identity Supabase itself confirms.
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || ''
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
}

// Returns the authenticated user if the request carries a valid Supabase
// access token (as `Authorization: Bearer <token>`), otherwise null.
export async function getVerifiedUser(req: Request) {
  const token = getBearerToken(req)
  if (!token) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

// Returns the caller's verified email if it's both a valid session AND
// present in the server-only ADMIN_EMAILS allowlist, otherwise null.
export async function getVerifiedAdminEmail(req: Request): Promise<string | null> {
  const user = await getVerifiedUser(req)
  if (!user?.email) return null

  const email = user.email.toLowerCase()
  if (ADMIN_EMAILS.length === 0 || !ADMIN_EMAILS.includes(email)) return null
  return email
}
