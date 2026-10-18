// Global types
//

// Supabase Database types
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
