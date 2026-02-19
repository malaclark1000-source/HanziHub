import { NextResponse } from 'next/server'

// Server-side only — never exposed to the client bundle
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ isAdmin: false })
  const isAdmin = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS[0] !== '' && ADMIN_EMAILS.includes(email.toLowerCase())
  return NextResponse.json({ isAdmin })
}
