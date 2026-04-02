'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Deck } from '../../utils/supabase'
import { useParams } from 'next/navigation'
import ErrorPage from 'next/error'
import { Header } from '@/components/layout/Header'
import { NotificationModal } from '@/components/layout/NotificationModal'

export default function DeckPage() {

  const router = useRouter()
  const [deck, setDeck] = useState<Deck>()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [, setUserId] = useState('')
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
          <Header onBellClick={() => setShowModal(true)} userEmail={userEmail} isAdmin={isAdmin} />
          {showModal && (
            <NotificationModal
              userEmail={userEmail}
              onClose={() => setShowModal(false)}
            />
          )}
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
