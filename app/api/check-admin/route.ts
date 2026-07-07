import { NextResponse } from 'next/server'
import { getVerifiedAdminEmail } from '@/lib/serverAuth'

// Admin status is derived from the caller's verified Supabase session token,
// never from a client-supplied email — otherwise anyone could pass any
// admin's email in the request body and be told "isAdmin: true".
export async function POST(req: Request) {
  const email = await getVerifiedAdminEmail(req)
  return NextResponse.json({ isAdmin: !!email })
}
