// Common utility functions used throughout the application

import { Deck } from "@/app/utils/supabase"
import { HANZI_HUB_STARTER_PACK_ID } from "./constants"

export const isStarterPack = (d: Deck) => {
    return d.id === HANZI_HUB_STARTER_PACK_ID
}

// Remembers (per browser) whether a visitor has already been shown the
// "New to Anki?" prompt. Storage can be unavailable (private mode, blocked
// site data), in which case we fail open and simply don't show the prompt.
const TUTORIAL_PROMPT_KEY = "hanzihub:tutorial-prompt-seen"

export const hasSeenTutorialPrompt = () => {
    try {
        return localStorage.getItem(TUTORIAL_PROMPT_KEY) !== null
    } catch {
        return true
    }
}

export const markTutorialPromptSeen = () => {
    try {
        localStorage.setItem(TUTORIAL_PROMPT_KEY, "1")
    } catch {
        // Storage unavailable; nothing to persist.
    }
}
