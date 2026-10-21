// UUID of starterpack collection containing all available decks
export const HANZI_HUB_STARTER_PACK_ID = "0b14bd33-452d-4e1f-9fde-074325362d82"

// Categories of decks/collections
export const CATEGORIES = [
    'Core',
    'Supplementary',
    'Collection',
]

// Deck types and the file extensions each one accepts on upload
export const DECK_TYPES = [
    { value: 'anki', label: 'Anki', extensions: ['apkg', 'colpkg', 'zip'] },
    { value: 'pleco', label: 'Pleco', extensions: ['txt'] },
] as const

export const deckTypeInfo = (deckType: string | undefined) =>
    DECK_TYPES.find(t => t.value === deckType) ?? DECK_TYPES[0]

// UI constant
export const DECK_CARD_HEIGHT = 52
