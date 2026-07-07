import { NextResponse } from 'next/server'
import { getVerifiedAdminEmail } from '@/lib/serverAuth'
import { createSupabaseServiceClient } from '@/lib/supabaseAdmin'

// Create a deck. Admin-only: the browser previously wrote to the `decks`
// table directly with the public anon key, which meant the only thing
// stopping a non-admin from doing the same thing from a console was luck.
export async function POST(req: Request) {
  const admin = await getVerifiedAdminEmail(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, description, category, version, fileUrl } = await req.json()
  if (!name || !description || !category || !version || !fileUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()
  const { error } = await supabase.from('decks').insert({
    name, description, category, current_version: version, file_url: fileUrl, download_count: 0,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Edit a deck's metadata. Admin-only.
export async function PATCH(req: Request) {
  const admin = await getVerifiedAdminEmail(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, name, description, category } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createSupabaseServiceClient()
  const { error } = await supabase.from('decks').update({ name, description, category }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Delete a deck and its related rows. Admin-only.
export async function DELETE(req: Request) {
  const admin = await getVerifiedAdminEmail(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createSupabaseServiceClient()
  await supabase.from('user_downloads').delete().eq('deck_id', id)
  await supabase.from('deck_versions').delete().eq('deck_id', id)
  const { error } = await supabase.from('decks').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
