'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Deck } from '@/app/utils/supabase'
import { Header } from '@/components/layout/Header'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { DECK_CARD_HEIGHT, HANZI_HUB_STARTER_PACK_ID } from '@/lib/constants'
import { isStarterPack } from '@/lib/utils'
import { checkNotificationPrefs } from '@/lib/notifications'
import { useApplicationStore, useApplicationStoreApi } from '@/providers/application-store-provider'


export default function DecksPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [starterPackDownloads, setStarterPackDownloads] = useState(0)

  const applicationStore = useApplicationStoreApi()
  const { user, decks, loadDecks, loadUser } = useApplicationStore((store) => store)

  // Used to update the number of downloads displayed for all other decks
  // Return the adjusted download count of a deck 
  const adjustedDownloadCount = (d: Deck) => {
    if (isStarterPack(d)) {
      return d.download_count
    } else {
      return d.download_count + starterPackDownloads
    }
  }

  useEffect(() => {
    async function init() {

      await loadUser()
      await loadDecks(false)

      const user = applicationStore.getState().user
      const decks = applicationStore.getState().decks

      // Update the number of starter pack downloads
      decks.forEach((d) => {
        if (d.id === HANZI_HUB_STARTER_PACK_ID) {
          setStarterPackDownloads(d.download_count)
        }
      })

      setLoading(false)

      if (user === undefined) {
        console.error("User not loaded")
      } else {
        if (await checkNotificationPrefs(user.userId)) {
          setShowModal(true)
        }
      }

    }
    init()
  }, [])

  async function handleDownload(deck: Deck) {

    if (!user) return
    setDownloadingId(deck.id)
    // Trigger download immediately in the click context — before any awaits
    // so browsers don't block it as a popup
    window.location.href = deck.file_url
    try {
      await supabase.from('user_downloads').upsert({
        user_id: user.userId,
        deck_id: deck.id,
        version_downloaded: deck.current_version,
        downloaded_at: new Date().toISOString(),
      }, { onConflict: 'user_id,deck_id' })
      await supabase.from('decks').update({ download_count: deck.download_count + 1 }).eq('id', deck.id)
      await loadDecks(true)
    } finally {
      setDownloadingId(null)
    }
  }

  const filtered = decks.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  )

  const CATEGORY_ORDER = ['Collection', 'Core', 'Supplementary']
  const categories = [...new Set(decks.map(d => d.category))].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  )

  if (user === undefined) {
    return <Suspense></Suspense>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onBellClick={() => setShowModal(true)} userEmail={user.userEmail} isAdmin={user.isAdmin} />
      {showModal && (
        <NotificationModal
          userEmail={user.userEmail}
          onClose={() => setShowModal(false)}
        />
      )}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Anki Decks</h1>
          <p className="text-slate-500 text-sm">Browse and download Mandarin study decks</p>
        </div>
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search decks..."
            className="w-full sm:w-80 px-4 py-2 border border-slate-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading decks...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No decks found.</div>
        ) : (
          <div className="space-y-8">
            {categories.filter(cat => filtered.some(d => d.category === cat)).map(category => (
              <div key={category}>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.filter(d => d.category === category).map(deck => (
                    <Link
                      key={deck.id}
                      href={`/decks/${deck.id}`}
                      className="block group"  // group allows hover effects on children
                    >
                      <div key={deck.id} className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow h-${DECK_CARD_HEIGHT} flex flex-col`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 leading-tight">{deck.name}</h3>
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                            v{deck.current_version}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-3">{deck.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs text-slate-400">{adjustedDownloadCount(deck)} downloads</span>
                          <button
                            onClick={() => handleDownload(deck)}
                            disabled={downloadingId === deck.id}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            {downloadingId === deck.id ? 'Downloading...' : 'Download'}
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
