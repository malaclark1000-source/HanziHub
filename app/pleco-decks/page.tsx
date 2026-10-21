'use client'

export const dynamic = 'force-dynamic'

import { DeckBrowser } from '@/components/decks/DeckBrowser'


export default function PlecoDecksPage() {
  return <DeckBrowser deckType="pleco" />
}
