import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Add or remove recipient emails here
const BUG_REPORT_RECIPIENTS = [
  'malaclark1000@gmail.com','mattbing901@gmail.com'
]

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: Request) {
  const { deckName, description, contactEmail } = await req.json()

  if (!description) return NextResponse.json({ error: 'Missing description' }, { status: 400 })

  await Promise.all(
    BUG_REPORT_RECIPIENTS.map(email =>
      transporter.sendMail({
        from: `HanziHub <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Bug Report${deckName ? `: ${deckName}` : ''}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <h2 style="margin-bottom: 8px;">New Bug Report</h2>
            ${deckName ? `<p style="color: #475569; margin-top: 0;"><strong>Deck:</strong> ${deckName}</p>` : ''}
            <p style="color: #475569;"><strong>Description:</strong><br>${description.replace(/\n/g, '<br>')}</p>
            ${contactEmail ? `<p style="color: #475569;"><strong>Contact:</strong> ${contactEmail}</p>` : ''}
          </div>
        `,
      })
    )
  )

  return NextResponse.json({ sent: BUG_REPORT_RECIPIENTS.length })
}
