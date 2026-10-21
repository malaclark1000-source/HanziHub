'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ErrorPage from 'next/error'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase, type DeckType, type DeckVersion } from '@/app/utils/supabase'
import { FreshnessBadge } from '@/components/decks/DeckCard'
import { deckTypeInfo } from '@/lib/constants'
import { downloadCount, timeAgo } from '@/lib/utils'
import { useDeckDownload } from '@/lib/useDeckDownload'
import { useApplicationStore } from '@/providers/application-store-provider'

// Display information for a single deck. `deckType` is the section of the
// site this page belongs to; a deck of the other type is redirected to its
// own section so the nav highlights the right page.
export function DeckDetail({ id, deckType }: { id: string; deckType: DeckType }) {

  const router = useRouter()

  // Local state
  const [loaded, setLoaded] = useState(false)
  const [versions, setVersions] = useState<DeckVersion[]>([])

  // Application state
  const { decks, loadDecks } = useApplicationStore((store) => store)
  const deck = decks.find((d) => d.id === id)
  const actualType = deckTypeInfo(deck?.deck_type)
  const { downloadingId, requestDownload, modal } = useDeckDownload(actualType.value)

  useEffect(() => {
    loadDecks(false).then(() => setLoaded(true))
  }, [loadDecks])

  useEffect(() => {
    if (deck && actualType.value !== deckType) router.replace(`${actualType.browsePath}/${deck.id}`)
  }, [deck, actualType, deckType, router])

  // Version history is optional extra detail; if it can't be read, the
  // section is simply hidden.
  useEffect(() => {
    supabase.from('deck_versions').select('*').eq('deck_id', id).order('created_at', { ascending: false })
      .then(({ data }) => setVersions((data as DeckVersion[] | null) ?? []))
  }, [id])

  if (loaded && !deck) return <ErrorPage statusCode={404} />

  if (!deck) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 animate-pulse" aria-hidden="true">
            <div className="h-8 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
            <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded mb-8" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  const { count, includesStarterPack } = downloadCount(deck, decks)
  const updated = timeAgo(deck.updated_at)
  const changelogs = versions.filter(v => v.changelog?.trim())

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {modal}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href={actualType.browsePath} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 mb-4">
          ← All {actualType.label} decks
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{deck.name}</h1>
                <FreshnessBadge deck={deck} />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">v{deck.current_version}</span>
                <span>{actualType.label} · {deck.category}</span>
                <span title={includesStarterPack ? 'Includes downloads of the Starter Pack, which contains this deck' : undefined}>
                  {count} downloads{includesStarterPack && ' (incl. Starter Pack)'}
                </span>
                {updated && <span>Updated {updated}</span>}
              </div>
            </div>
            <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
              <button
                onClick={() => requestDownload(deck)}
                disabled={downloadingId === deck.id}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                {downloadingId === deck.id ? 'Downloading...' : 'Download'}
              </button>
              <Link href={actualType.tutorialPath} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-center">
                How to import into {actualType.label} →
              </Link>
            </div>
          </div>

          {/* Deck Description */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Description</h2>
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {deck.description || 'No description'}
              </ReactMarkdown>
            </div>
          </div>

          {/* Version history */}
          {changelogs.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">What&apos;s changed</h2>
              <ol className="space-y-3">
                {changelogs.map(v => (
                  <li key={v.id} className="text-sm">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">v{v.version}</span>
                      {timeAgo(v.created_at) && <span className="text-slate-400 dark:text-slate-500">{timeAgo(v.created_at)}</span>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{v.changelog}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
