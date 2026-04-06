'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Deck } from '@/app/utils/supabase'
import { DECK_CARD_HEIGHT } from '@/lib/constants'

type DownloadedDeck = Deck & { version_downloaded: string; downloaded_at: string }

export default function DashboardPage() {
  const router = useRouter()
  const [downloads, setDownloads] = useState<DownloadedDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/auth/login')
        return
      }
      setUserEmail(session.user.email || '')
      const adminRes = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      })
      const { isAdmin: admin } = await adminRes.json()
      setIsAdmin(admin)
      // Get user's downloads joined with deck info
      const { data: userDownloads } = await supabase
        .from('user_downloads')
        .select('deck_id, version_downloaded, downloaded_at')
        .eq('user_id', session.user.id)
        .order('downloaded_at', { ascending: false })
      if (!userDownloads || userDownloads.length === 0) {
        setLoading(false)
        return
      }
      const deckIds = userDownloads.map(d => d.deck_id)
      const { data: decks } = await supabase
        .from('decks')
        .select('*')
        .in('id', deckIds)
      const merged: DownloadedDeck[] = (decks || []).map(deck => {
        const dl = userDownloads.find(d => d.deck_id === deck.id)!
        return { ...deck, version_downloaded: dl.version_downloaded, downloaded_at: dl.downloaded_at }
      }).sort((a, b) => new Date(b.downloaded_at).getTime() - new Date(a.downloaded_at).getTime())
      setDownloads(merged)
      setLoading(false)
    }
    init()
  }, [router])

  async function handleUpdate(deck: DownloadedDeck) {
    setUpdatingId(deck.id)
    // Trigger download immediately in the click context — before any awaits
    window.location.href = deck.file_url
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('user_downloads').upsert({
        user_id: user.id,
        deck_id: deck.id,
        version_downloaded: deck.current_version,
        downloaded_at: new Date().toISOString(),
      }, { onConflict: 'user_id,deck_id' })
      setDownloads(prev => prev.map(d =>
        d.id === deck.id ? { ...d, version_downloaded: deck.current_version } : d
      ))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Downloads</h1>
          <p className="text-slate-500 text-sm">Decks you&apos;ve downloaded</p>
        </div>
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading your downloads...</div>
        ) : downloads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">You haven&apos;t downloaded any decks yet.</p>
            <Link href="/decks" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Browse Decks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloads.map(deck => {
              const hasUpdate = deck.current_version !== deck.version_downloaded
              return (

                <Link
                  key={deck.id}
                  href={`/decks/${deck.id}`}
                  className="block group"  // group allows hover effects on children
                >
                  <div
                    key={deck.id}
                    className={`bg-white rounded-xl border p-5 hover:shadow-md flex flex-col transition-shadow h-${DECK_CARD_HEIGHT} ${hasUpdate ? 'border-amber-300' : 'border-slate-200'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 leading-tight">{deck.name}</h3>
                      {hasUpdate ? (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                          Update Available
                        </span>
                      ) : (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                          Up to date
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-1">
                      Downloaded: v{deck.version_downloaded}
                      {hasUpdate && <span className="text-amber-600"> → v{deck.current_version} available</span>}
                    </p>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-3">{deck.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-slate-400">{deck.category}</span>
                      {hasUpdate ? (
                        <button
                          onClick={() => handleUpdate(deck)}
                          disabled={updatingId === deck.id}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {updatingId === deck.id ? 'Updating...' : 'Download Update'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            event?.stopPropagation()
                            window.location.href = deck.file_url
                          }}
                          className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          Re-download
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
