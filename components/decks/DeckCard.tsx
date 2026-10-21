import Link from 'next/link'
import { type Deck } from '@/app/utils/supabase'
import { deckTypeInfo } from '@/lib/constants'
import { freshnessBadge } from '@/lib/utils'

// Badge for decks added or re-versioned recently
export function FreshnessBadge({ deck }: { deck: Deck }) {
  const badge = freshnessBadge(deck)
  if (!badge) return null
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${badge === 'New' ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>
      {badge}
    </span>
  )
}

export function DeckCard({ deck, downloads, includesStarterPack, downloading, onDownload }: {
  deck: Deck
  downloads: number
  includesStarterPack: boolean
  downloading: boolean
  onDownload: () => void
}) {
  return (
    // The title link is stretched over the whole card, so the card opens the
    // deck while the Download button (raised above it) stays its own control
    <div className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all h-full flex flex-col focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
          <Link href={`${deckTypeInfo(deck.deck_type).browsePath}/${deck.id}`} className="after:absolute after:inset-0 focus:outline-none">
            {deck.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <FreshnessBadge deck={deck} />
          <span className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
            v{deck.current_version}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">{deck.description}</p>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="text-xs text-slate-400 dark:text-slate-500" title={includesStarterPack ? 'Includes downloads of the Starter Pack, which contains this deck' : undefined}>
          {downloads} downloads{includesStarterPack && ' (incl. Starter Pack)'}
        </span>
        <button
          onClick={onDownload}
          disabled={downloading}
          className="relative z-10 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  )
}

// Placeholder in the shape of a DeckCard while decks load
export function DeckCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 h-52 flex flex-col animate-pulse" aria-hidden="true">
      <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded" />
        <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>
    </div>
  )
}
