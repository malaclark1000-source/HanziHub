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

  if (isRateLimited(`notify-update:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { deckId, deckName, version, changelog } = await req.json()
  if (!deckId || !deckName || !version) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()

  // Find all users who have downloaded this deck
  const { data: downloads } = await supabase
    .from('user_downloads')
    .select('user_id')
    .eq('deck_id', deckId)

  if (!downloads?.length) return NextResponse.json({ sent: 0 })

  const userIds = downloads.map(d => d.user_id)

  // Find their notification prefs where update notifications are enabled
  const { data: prefs } = await supabase
    .from('notification_prefs')
    .select('email')
    .in('user_id', userIds)
    .eq('notify_updates', true)

  if (!prefs?.length) return NextResponse.json({ sent: 0 })

  // TEST MODE: remove this line and the override below when ready for production
  const TEST_EMAIL = process.env.TEST_EMAIL
  const emails = TEST_EMAIL ? [TEST_EMAIL] : [...new Set(prefs.map(p => p.email).filter(Boolean))]

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanzihub.com'
  const safeDeckName = escapeHtml(deckName)
  const safeVersion = escapeHtml(version)
  const safeSubject = sanitizeHeaderValue(`${deckName} has been updated to v${version}`)
  const safeChangelog = changelog ? escapeHtml(changelog).replace(/\n/g, '<br>') : ''

  await Promise.all(
    emails.map(email =>
      transporter.sendMail({
        from: `HanziHub <${process.env.GMAIL_USER}>`,
        to: email,
        subject: safeSubject,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <h2 style="margin-bottom: 8px;">Deck Updated: ${safeDeckName}</h2>
            <p style="color: #475569; margin-top: 0;">A deck you downloaded has been updated to <strong>v${safeVersion}</strong>.</p>
            ${safeChangelog ? `<p style="color: #475569;"><strong>What's new:</strong><br>${safeChangelog}</p>` : ''}
            <a href="${siteUrl}/dashboard" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">Download Update</a>
          </div>
        `,
      })
    )
  )

  return NextResponse.json({ sent: emails.length })
}
