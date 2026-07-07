import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getVerifiedAdminEmail } from '@/lib/serverAuth'
import { createSupabaseServiceClient } from '@/lib/supabaseAdmin'
import { escapeHtml, sanitizeHeaderValue } from '@/lib/html'
import { isRateLimited, getClientIp } from '@/lib/rateLimit'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: Request) {
  const admin = await getVerifiedAdminEmail(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (isRateLimited(`notify-manual:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { deckId, subject, message } = await req.json()
  if (!deckId || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()

  const { data: downloads } = await supabase
    .from('user_downloads')
    .select('user_id')
    .eq('deck_id', deckId)

  if (!downloads?.length) return NextResponse.json({ sent: 0 })

  const userIds = downloads.map(d => d.user_id)

  const { data: prefs } = await supabase
    .from('notification_prefs')
    .select('email')
    .in('user_id', userIds)
    .eq('notify_updates', true)

  if (!prefs?.length) return NextResponse.json({ sent: 0 })

  // TEST MODE: remove this line and the override below when ready for production
  const TEST_EMAIL = process.env.TEST_EMAIL
  const emails = TEST_EMAIL ? [TEST_EMAIL] : [...new Set(prefs.map(p => p.email).filter(Boolean))]

  const safeSubject = sanitizeHeaderValue(subject)
  const safeMessage = escapeHtml(message)

  await Promise.all(
    emails.map(email =>
      transporter.sendMail({
        from: `HanziHub <${process.env.GMAIL_USER}>`,
        to: email,
        subject: safeSubject,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <p style="color: #475569; white-space: pre-line;">${safeMessage}</p>
          </div>
        `,
      })
    )
  )

  return NextResponse.json({ sent: emails.length })
}
