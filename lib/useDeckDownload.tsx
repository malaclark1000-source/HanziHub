'use client'

import { useCallback, useState } from 'react'
import { supabase, type Deck, type DeckType } from '@/app/utils/supabase'
import { NewUserModal } from '@/components/layout/NewUserModal'
import { hasSeenTutorialPrompt, markTutorialPromptSeen } from '@/lib/utils'
import { useApplicationStore } from '@/providers/application-store-provider'

// Download a deck, pointing first-time visitors at the matching tutorial
// first. Render `modal` somewhere on the page for the tutorial prompt.
export function useDeckDownload(deckType: DeckType) {

  const loadDecks = useApplicationStore((store) => store.loadDecks)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [pendingDeck, setPendingDeck] = useState<Deck | null>(null)

  async function proceedWithDownload(deck: Deck) {
    setPendingDeck(null)
    markTutorialPromptSeen(deckType)

    setDownloadingId(deck.id)
    // Trigger download immediately in the click context — before any awaits
    // so browsers don't block it as a popup
    window.location.href = deck.file_url
    try {
      // Uses a Postgres function (not a raw table update) so a client can only
      // ever atomically +1 this counter — never overwrite it to an arbitrary
      // value or touch any other column on the deck.
      await supabase.rpc('increment_deck_download_count', { deck_id: deck.id })
      await loadDecks(true)
    } finally {
      setDownloadingId(null)
    }
  }

  function requestDownload(deck: Deck) {
    if (!hasSeenTutorialPrompt(deckType)) {
      setPendingDeck(deck)
      return
    }
    proceedWithDownload(deck)
  }

  const closeModal = useCallback(() => setPendingDeck(null), [])

  const modal = pendingDeck && (
    <NewUserModal
      deckType={deckType}
      onClick={() => proceedWithDownload(pendingDeck)}
      onReadTutorial={() => markTutorialPromptSeen(deckType)}
      onClose={closeModal}
    />
  )

  return { downloadingId, requestDownload, modal }
}
