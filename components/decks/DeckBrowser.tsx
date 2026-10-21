'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type DeckType } from '@/app/utils/supabase'
import { DeckCard, DeckCardSkeleton } from '@/components/decks/DeckCard'
import { FilterChips } from '@/components/ui/FilterChips'
import { deckTypeInfo } from '@/lib/constants'
import { downloadCount } from '@/lib/utils'
import { useDeckDownload } from '@/lib/useDeckDownload'
import { useApplicationStore } from '@/providers/application-store-provider'

const CATEGORY_ORDER = ['Collection', 'Core', 'Supplementary']

const TAGLINES: Record<DeckType, string> = {
  anki: 'Spaced-repetition study decks for the Anki app on desktop and phone.',
  pleco: 'Flashcard lists to import into the Pleco dictionary app on your phone.',
}


// Searchable, category-grouped list of every deck of one type (Anki or Pleco)
export function DeckBrowser({ deckType }: { deckType: DeckType }) {

  const { label, tutorialPath } = deckTypeInfo(deckType)

  // Local state
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const { downloadingId, requestDownload, modal } = useDeckDownload(deckType)

  // Application state
  const { decks: allDecks, loadDecks } = useApplicationStore((store) => store)
  const decks = allDecks.filter(d => deckTypeInfo(d.deck_type).value === deckType)

  useEffect(() => {
    loadDecks(false).then(() => setLoading(false))
  }, [loadDecks])

  const query = search.toLowerCase()
  const filtered = decks.filter(d =>
    (!selectedCategory || d.category === selectedCategory) && (
      d.name.toLowerCase().includes(query) ||
      d.category.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    )
  )

  const categories = [...new Set(decks.map(d => d.category))].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {modal}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{label} Decks</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{TAGLINES[deckType]}</p>
          </div>
          <Link href={tutorialPath} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium whitespace-nowrap">
            How to import into {label} →
          </Link>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search decks..."
            aria-label="Search decks"
            className="w-full sm:w-80 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {categories.length > 1 && (
            <FilterChips options={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map(i => <DeckCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            {decks.length === 0 ? `No ${label} decks yet. Check back soon!` : 'No decks found.'}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.filter(cat => filtered.some(d => d.category === cat)).map(category => (
              <div key={category}>
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.filter(d => d.category === category).map(deck => {
                    const { count, includesStarterPack } = downloadCount(deck, allDecks)
                    return (
                      <DeckCard
                        key={deck.id}
                        deck={deck}
                        downloads={count}
                        includesStarterPack={includesStarterPack}
                        downloading={downloadingId === deck.id}
                        onDownload={() => requestDownload(deck)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
