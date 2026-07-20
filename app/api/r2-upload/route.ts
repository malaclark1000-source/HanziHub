import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'
import { getVerifiedAdminEmail } from '@/lib/serverAuth'
import { isRateLimited, getClientIp } from '@/lib/rateLimit'

// Only real Anki deck file types are allowed (.apkg/.colpkg are zip archives)
// — this prevents someone from uploading e.g. an HTML/SVG file that gets
// served back from the public bucket and executes in a browser (stored XSS
// via the CDN).
const ALLOWED_CONTENT_TYPES = new Set([
  'application/octet-stream',
  'application/zip',
  'application/x-zip-compressed',
])

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
    const { filename, contentType, deckName } = await req.json()
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 })
    }
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
    // Create a unique key using timestamp to avoid collisions
    const timestamp = Date.now()
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `decks/${timestamp}-${sanitized}`

    // Build a clean download filename from the deck name
    const ext = filename.includes('.') ? filename.split('.').pop() : 'apkg'
    const downloadFilename = deckName
      ? `${deckName.replace(/[^a-zA-Z0-9\s_-]/g, '').trim().replace(/\s+/g, '_')}.${ext}`
      : sanitized
    const contentDisposition = `attachment; filename="${downloadFilename}"`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ContentDisposition: contentDisposition,
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    const publicUrl = `${R2_PUBLIC_URL}/${key}`

    return NextResponse.json({ uploadUrl, publicUrl, contentDisposition })
  } catch (error: unknown) {
    console.error('R2 upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
