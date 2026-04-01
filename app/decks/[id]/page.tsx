'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Deck } from '../../utils/supabase'
import { useParams } from 'next/navigation'
import ErrorPage from 'next/error'
import React from 'react'

import Link from 'next/link'

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

export default function DeckPage() {

  const router = useRouter()
  // const [decks, setDecks] = useState<Deck[]>([])
  const [deck, setDeck] = useState<Deck>()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [errorStatus, setErrorStatus] = useState(200)

  const params = useParams()
  const id = params.id as string

  const loadDeck = useCallback(async () => {
    const { data } = await supabase.from('decks').select('*').eq("id", id).single() as { data: Deck }
    if (!data) {
      setErrorStatus(404)
    } else {
      setDeck(data)
    }
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
      await loadDeck()
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
  }, [router, loadDeck])

  if (loading) {
    return <Suspense />
  } else {

    if (errorStatus != 200) {
      return <ErrorPage statusCode={errorStatus} />
    } else {
      return (
        <div className="min-h-screen bg-slate-50">
          <Header
            onBellClick={() => { }}
            userEmail=""
            isAdmin={false}
          />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              {/* Deck Name */}
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {deck?.name}
              </h1>

              {/* Deck Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Description
                </h2>
                <p className="text-slate-600 whitespace-pre-wrap">
                  {deck?.description}
                </p>
              </div>

              {/* Optional: Back button */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <a
                  href="/decks"
                  className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2"
                >
                  ← Back to all decks
                </a>
              </div>
            </div>
          </main>
        </div>
      )
    }
  }
}
