import { NextResponse } from 'next/server'
import { getVerifiedAdminEmail } from '@/lib/serverAuth'
import { createSupabaseServiceClient } from '@/lib/supabaseAdmin'

// Bump a deck to a new version and record the version history. Admin-only.
export async function POST(req: Request) {
  const admin = await getVerifiedAdminEmail(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, version, fileUrl, changelog } = await req.json()
  if (!id || !version || !fileUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()

  const { error: updateError } = await supabase.from('decks').update({
    current_version: version, file_url: fileUrl, updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  const { error: versionError } = await supabase.from('deck_versions').insert({
    deck_id: id, version, changelog, file_url: fileUrl,
  })
  if (versionError) return NextResponse.json({ error: versionError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
