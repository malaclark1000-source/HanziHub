import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

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
  try {
    const { filename, contentType } = await req.json()
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 })
    }
    // Create a unique key using timestamp to avoid collisions
    const timestamp = Date.now()
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `decks/${timestamp}-${sanitized}`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    const publicUrl = `${R2_PUBLIC_URL}/${key}`

    return NextResponse.json({ uploadUrl, publicUrl })
  } catch (error: unknown) {
    console.error('R2 upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
