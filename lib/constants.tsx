// UUID of starterpack collection containing all available decks
export const HANZI_HUB_STARTER_PACK_ID = "0b14bd33-452d-4e1f-9fde-074325362d82"

// Categories of decks/collections
export const CATEGORIES = [
    'Core',
    'Supplementary',
    'Collection',
]

// Deck types: the file extensions each one accepts on upload, and where its
// browse page and tutorial live
export const DECK_TYPES = [
    {
        value: 'anki', label: 'Anki', extensions: ['apkg', 'colpkg', 'zip'],
        browsePath: '/decks', tutorialPath: '/tutorials',
    },
    {
        value: 'pleco', label: 'Pleco', extensions: ['txt'],
        browsePath: '/pleco-decks', tutorialPath: '/tutorials/pleco',
    },
] as const

export const deckTypeInfo = (deckType: string | undefined) =>
    DECK_TYPES.find(t => t.value === deckType) ?? DECK_TYPES[0]

// Shown in the header "Report a bug" link, the footer and the tutorials
export const CONTACT_EMAIL = "malaclark1000@gmail.com"
export const BUG_REPORT_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Hanzi Hub bug report')}`

// Decks created or updated within this many days get a "New"/"Updated" badge
export const FRESH_DECK_DAYS = 30
