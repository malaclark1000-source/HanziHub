import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Deck = {
  id: string
  name: string
  description: string
  category: string
  current_version: string
  file_url: string
  download_count: number
  created_at: string
  updated_at: string
}

export type DeckVersion = {
  id: string
  deck_id: string
  version: string
  changelog: string
  file_url: string
  created_at: string
}

export type UserDownload = {
  user_id: string
  deck_id: string
  version_downloaded: string
  downloaded_at: string
}

export type NotificationPref = {
  user_id: string
  email: string
  notify_updates: boolean
  notify_new_decks: boolean
  has_responded: boolean
  updated_at: string
}
