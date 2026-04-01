'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Deck, type NotificationPref } from '../utils/supabase'

function Header({ onBellClick, userEmail, isAdmin }: { onBellClick: () => void; userEmail: string; isAdmin: boolean }) {
  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }
  const navLinks = (mobile?: boolean) => (
    <>
      <Link href="/decks" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-medium whitespace-nowrap' : 'text-blue-600 font-medium'}>Browse Decks</Link>
      <Link href="/dashboard" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>My Downloads</Link>
      <Link href="/tutorials" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>Tutorials</Link>
      <Link href="/report-bug" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>Report Bug</Link>
      {isAdmin && <Link href="/admin" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-purple-600 hover:bg-purple-50 font-medium whitespace-nowrap' : 'text-purple-600 hover:text-purple-700 font-medium'}>Admin</Link>}
    </>
  )
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/decks" className="text-xl font-bold text-slate-900">汉字 Hub</Link>
          <nav className="hidden sm:flex gap-4 text-sm">{navLinks()}</nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onBellClick} title="Notification preferences" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">🔔</button>
          <span className="hidden sm:block text-sm text-slate-500">{userEmail}</span>
          <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Sign out</button>
        </div>
      </div>
      <div className="sm:hidden border-t border-slate-100">
        <nav className="flex gap-1 px-4 py-2 overflow-x-auto">{navLinks(true)}</nav>
      </div>
    </header>
  )
}

function NotificationModal({
  userEmail,
  onClose,
}: {
  userEmail: string
  onClose: () => void
}) {
  const [email, setEmail] = useState(userEmail)
  const [notifyUpdates, setNotifyUpdates] = useState(true)
  const [notifyNew, setNotifyNew] = useState(true)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('notification_prefs').upsert({
        user_id: user.id,
        email: email,
        notify_updates: notifyUpdates,
        notify_new_decks: notifyNew,
        has_responded: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setSaved(true)
      setTimeout(onClose, 1200)
    } finally {
      setLoading(false)
    }
  }

  async function handleDecline() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { onClose(); return }
    await supabase.from('notification_prefs').upsert({
      user_id: user.id,
      email: userEmail,
      notify_updates: false,
      notify_new_decks: false,
      has_responded: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Stay in the loop</h2>
        <p className="text-sm text-slate-600 mb-5">
          Get notified when decks are updated or new decks are added.
        </p>

        {saved ? (
          <div className="text-center py-4 text-green-600 font-medium">Preferences saved!</div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email for notifications</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyUpdates}
                  onChange={e => setNotifyUpdates(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-sm text-slate-700">Notify me when a deck I downloaded gets updated</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyNew}
                  onChange={e => setNotifyNew(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-sm text-slate-700">Notify me when a new deck is added</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm"
              >
                No thanks
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Starter pack .colpkg deck id, used to update the display downloads for all other decks
const HANZI_HUB_STARTER_PACK_ID = "0b14bd33-452d-4e1f-9fde-074325362d82"

const isStarterPack = (d: Deck) => {
  return d.id === HANZI_HUB_STARTER_PACK_ID
}

export default function DecksPage() {
  const router = useRouter()
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [starterPackDownloads, setStarterPackDownloads] = useState(0)

  // Used to update the number of downloads displayed for all other decks
  // Return the adjusted download count of a deck 
  const adjustedDownloadCount = (d: Deck) => {
    if (isStarterPack(d)) {
      return d.download_count
    } else {
      return d.download_count + starterPackDownloads
    }
  }

  const loadDecks = useCallback(async () => {
    const { data } = await supabase.from('decks').select('*').order('name') as { data: Deck[] }
    setDecks(data || [])

    data.forEach((d) => {
      if (d.id === HANZI_HUB_STARTER_PACK_ID) {
        setStarterPackDownloads(d.download_count)
      }
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/auth/login')
        return
      }
      setUserEmail(session.user.email || '')
      setUserId(session.user.id)
      const adminRes = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      })
      const { isAdmin: admin } = await adminRes.json()
      setIsAdmin(admin)
      await loadDecks()
      // Check if user has responded to notification prefs
      const { data: prefs } = await supabase
        .from('notification_prefs')
        .select('has_responded')
        .eq('user_id', session.user.id)
        .single()
      if (!prefs?.has_responded) {
        setShowModal(true)
      }
    }
    init()
  }, [router, loadDecks])

  async function handleDownload(deck: Deck) {
    if (!userId) return
    setDownloadingId(deck.id)
    // Trigger download immediately in the click context — before any awaits
    // so browsers don't block it as a popup
    window.location.href = deck.file_url
    try {
      await supabase.from('user_downloads').upsert({
        user_id: userId,
        deck_id: deck.id,
        version_downloaded: deck.current_version,
        downloaded_at: new Date().toISOString(),
      }, { onConflict: 'user_id,deck_id' })
      await supabase.from('decks').update({ download_count: deck.download_count + 1 }).eq('id', deck.id)
      await loadDecks()
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onBellClick={() => setShowModal(true)} userEmail={userEmail} isAdmin={isAdmin} />
      {showModal && (
        <NotificationModal
          userEmail={userEmail}
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
                      <div key={deck.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 leading-tight">{deck.name}</h3>
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                            v{deck.current_version}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{deck.description}</p>
                        <div className="flex items-center justify-between">
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
