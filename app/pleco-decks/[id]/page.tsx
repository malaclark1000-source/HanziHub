'use client'

export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import { DeckDetail } from '@/components/decks/DeckDetail'

export default function PlecoDeckPage() {
  const { id } = useParams<{ id: string }>()
  return <DeckDetail id={id} deckType="pleco" />
}
