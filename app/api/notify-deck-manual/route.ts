import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: Request) {
  const { deckId, subject, message } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

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

  await Promise.all(
    emails.map(email =>
      transporter.sendMail({
        from: `HanziHub <${process.env.GMAIL_USER}>`,
        to: email,
        subject,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <p style="color: #475569; white-space: pre-line;">${message}</p>
          </div>
        `,
      })
    )
  )

  return NextResponse.json({ sent: emails.length })
}
