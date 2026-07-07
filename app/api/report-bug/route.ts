import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getVerifiedUser } from '@/lib/serverAuth'
import { escapeHtml } from '@/lib/html'
import { isRateLimited, getClientIp } from '@/lib/rateLimit'

// Add or remove recipient emails here
const BUG_REPORT_RECIPIENTS = [
  'malaclark1000@gmail.com','mattbing901@gmail.com','ejovo13@yahoo.com'
]

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: Request) {
  // Must be a logged-in user — stops this from being an open email relay.
  const user = await getVerifiedUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (isRateLimited(`report-bug:${getClientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { deckName, description, contactEmail } = await req.json()

  if (!description) return NextResponse.json({ error: 'Missing description' }, { status: 400 })

  const safeDeckName = deckName ? escapeHtml(deckName) : ''
  const safeDescription = escapeHtml(description).replace(/\n/g, '<br>')
  const safeContactEmail = contactEmail ? escapeHtml(contactEmail) : ''

  await Promise.all(
    BUG_REPORT_RECIPIENTS.map(email =>
      transporter.sendMail({
        from: `HanziHub <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Bug Report${deckName ? `: ${deckName}` : ''}`.replace(/[\r\n]+/g, ' '),
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <h2 style="margin-bottom: 8px;">New Bug Report</h2>
            ${safeDeckName ? `<p style="color: #475569; margin-top: 0;"><strong>Deck:</strong> ${safeDeckName}</p>` : ''}
            <p style="color: #475569;"><strong>Description:</strong><br>${safeDescription}</p>
            ${safeContactEmail ? `<p style="color: #475569;"><strong>Contact:</strong> ${safeContactEmail}</p>` : ''}
          </div>
        `,
      })
    )
  )

  return NextResponse.json({ sent: BUG_REPORT_RECIPIENTS.length })
}
