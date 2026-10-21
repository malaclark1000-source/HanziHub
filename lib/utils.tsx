// Common utility functions used throughout the application

import { Deck, DeckType } from "@/app/utils/supabase"
import { HANZI_HUB_STARTER_PACK_ID } from "./constants"

export const isStarterPack = (d: Deck) => {
    return d.id === HANZI_HUB_STARTER_PACK_ID
}

// Remembers (per browser) whether a visitor has already been shown the
// "New to Anki?" / "New to Pleco?" prompt for a deck type. Storage can be
// unavailable (private mode, blocked site data), in which case we fail open
// and simply don't show the prompt.
// The Anki key predates Pleco decks; it's kept so returning visitors aren't re-prompted.
const tutorialPromptKey = (deckType: DeckType) =>
    deckType === "anki" ? "hanzihub:tutorial-prompt-seen" : `hanzihub:${deckType}-tutorial-prompt-seen`

export const hasSeenTutorialPrompt = (deckType: DeckType) => {
    try {
        return localStorage.getItem(tutorialPromptKey(deckType)) !== null
    } catch {
        return true
    }
}

export const markTutorialPromptSeen = (deckType: DeckType) => {
    try {
        localStorage.setItem(tutorialPromptKey(deckType), "1")
    } catch {
        // Storage unavailable; nothing to persist.
    }
}
