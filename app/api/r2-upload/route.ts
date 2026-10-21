import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'
import { getVerifiedAdminEmail } from '@/lib/serverAuth'
import { isRateLimited, getClientIp } from '@/lib/rateLimit'
import { DECK_TYPES } from '@/lib/constants'

// Only deck files are allowed: Anki packages (.apkg/.colpkg are zip archives)
// or Pleco plain-text lists (.txt), matched against the deck's type. We check
// the extension rather than the browser-reported MIME type, which varies by
// OS (e.g. Windows reports Anki's own type once Anki is installed). Every
// file is stored as a generic binary download regardless, so nothing served
// back from the public bucket can render in a browser (stored XSS via the CDN).
const CONTENT_TYPE = 'application/octet-stream'

const R2_ENDPOINT = process.env.R2_ENDPOINT!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export async function POST(req: Request) {
  const admin = await getVerifiedAdminEmail(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (isRateLimited(`r2-upload:${getClientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { filename, deckName, deckType } = await req.json()
    if (!filename) {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 })
    }
    const type = DECK_TYPES.find(t => t.value === deckType)
    if (!type) {
      return NextResponse.json({ error: 'Unknown deck type' }, { status: 400 })
    }
    const ext = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : ''
    if (!(type.extensions as readonly string[]).includes(ext)) {
      const expected = type.extensions.map(e => `.${e}`).join(', ')
      return NextResponse.json({ error: `Unsupported file type for a ${type.label} deck (expected ${expected})` }, { status: 400 })
    }
    // Create a unique key using timestamp to avoid collisions
    const timestamp = Date.now()
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `decks/${timestamp}-${sanitized}`

    // Build a clean download filename from the deck name
    const downloadFilename = deckName
      ? `${deckName.replace(/[^a-zA-Z0-9\s_-]/g, '').trim().replace(/\s+/g, '_')}.${ext}`
      : sanitized
    const contentDisposition = `attachment; filename="${downloadFilename}"`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: CONTENT_TYPE,
      ContentDisposition: contentDisposition,
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    const publicUrl = `${R2_PUBLIC_URL}/${key}`

    // The signed URL only accepts the exact headers it was signed with, so the
    // client must send these back verbatim on the PUT.
    return NextResponse.json({ uploadUrl, publicUrl, contentType: CONTENT_TYPE, contentDisposition })
  } catch (error: unknown) {
    console.error('R2 upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
