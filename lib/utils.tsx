// Common utility functions used throughout the application

import { Deck, DeckType } from "@/app/utils/supabase"
import { FRESH_DECK_DAYS, HANZI_HUB_STARTER_PACK_ID, deckTypeInfo } from "./constants"

export const isStarterPack = (d: Deck) => {
    return d.id === HANZI_HUB_STARTER_PACK_ID
}

// The starter pack is an Anki collection containing every Anki deck, so each
// download of it also counts toward every other Anki deck.
export const downloadCount = (d: Deck, allDecks: Deck[]) => {
    const starterPack = allDecks.find(isStarterPack)
    const includesStarterPack = deckTypeInfo(d.deck_type).value === "anki" && !isStarterPack(d) && starterPack !== undefined
    return {
        count: d.download_count + (includesStarterPack ? starterPack.download_count : 0),
        includesStarterPack,
    }
}

const DAY_MS = 24 * 60 * 60 * 1000

const daysSince = (iso: string | null | undefined) => {
    const time = iso ? Date.parse(iso) : NaN
    return Number.isNaN(time) ? Infinity : (Date.now() - time) / DAY_MS
}

// "New" for recently added decks, "Updated" for recently re-versioned ones
export const freshnessBadge = (d: Deck): "New" | "Updated" | null => {
    if (daysSince(d.created_at) <= FRESH_DECK_DAYS) return "New"
    if (daysSince(d.updated_at) <= FRESH_DECK_DAYS) return "Updated"
    return null
}

// e.g. "today", "3 days ago", "2 months ago"
export const timeAgo = (iso: string | null | undefined) => {
    const days = Math.floor(daysSince(iso))
    if (!Number.isFinite(days)) return null
    if (days < 1) return "today"
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
    if (days < 30) return rtf.format(-days, "day")
    if (days < 365) return rtf.format(-Math.floor(days / 30), "month")
    return rtf.format(-Math.floor(days / 365), "year")
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
