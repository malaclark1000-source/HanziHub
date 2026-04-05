'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import ErrorPage from 'next/error'
import { Header } from '@/components/layout/Header'
import { NotificationModal } from '@/components/layout/NotificationModal'
import Link from 'next/link'
import { useApplicationStore } from '@/providers/application-store-provider'
import { useApplicationStoreApi } from '@/providers/application-store-provider'
import { Deck } from '@/types/types'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Display information for a single deck
export default function DeckPage() {

  // Local state
  const [deck, setDeck] = useState<Deck>()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [errorStatus, setErrorStatus] = useState(200)

  // Application state
  const applicationStore = useApplicationStoreApi()
  const { user, loadDecks, loadUser } = useApplicationStore((store) => store)

  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    async function init() {

      await loadUser()
      await loadDecks(false)

      const user = applicationStore.getState().user
      const decks = applicationStore.getState().decks

      // Retrieve the deck that a user clicked on
      const requestedDeck = decks.find((d) => (d.id == id))
      if (requestedDeck === undefined) {
        setErrorStatus(404)
        return
      } else {
        setDeck(requestedDeck)
      }

      setLoading(false)

      if (user === undefined) {
        console.error("User not loaded")
      } else {
        if (!user.hasRespondedNotifications) {
          setShowModal(true)
        }
      }

    }
    init()
  }, [])

  if (loading || user === undefined) {
    return <Suspense />
  } else {

    if (errorStatus != 200) {
      return <ErrorPage statusCode={errorStatus} />
    } else {
      return (
        <div className="min-h-screen bg-slate-50">
          <Header onBellClick={() => setShowModal(true)} userEmail={user.userEmail} isAdmin={user.isAdmin} />
          {showModal && (
            <NotificationModal
              userEmail={user.userEmail}
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
                <div className="list-decimal prose prose-slate-600">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {(() => {
                      console.log('Raw markdown content:', deck?.description);
                      return deck?.description || '';
                    })()}
                  </ReactMarkdown>
                </div>
              </div>

              <Link
                href="/decks"
                className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2"
              >
                ← Back to all decks
              </Link>
            </div>
          </main >
        </div >
      )
    }
  }
}
