'use client'

export const dynamic = 'force-dynamic'

import { DeckBrowser } from '@/components/decks/DeckBrowser'


export default function DecksPage() {
  return <DeckBrowser deckType="anki" />
}
