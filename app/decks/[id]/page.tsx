'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ErrorPage from 'next/error'
import { useApplicationStore } from '@/providers/application-store-provider'
import { useApplicationStoreApi } from '@/providers/application-store-provider'
import { Deck } from '@/types/types'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Display information for a single deck
export default function DeckPage() {

  // Next.js routing stuff
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  // Local state
  const [deck, setDeck] = useState<Deck>()
  const [errorStatus, setErrorStatus] = useState(200)

  // Application state
  const applicationStore = useApplicationStoreApi()
  const loadDecks = useApplicationStore((store) => store.loadDecks)


  useEffect(() => {
    async function init() {

      await loadDecks(false)
      const decks = applicationStore.getState().decks

      // Retrieve the deck that a user clicked on
      const requestedDeck = decks.find((d) => (d.id == id))
      if (requestedDeck === undefined) {
        setErrorStatus(404)
        return
      } else {
        setDeck(requestedDeck)
      }
    }
    init()
  }, [router])

  if (errorStatus != 200) {
    return <ErrorPage statusCode={errorStatus} />
  } else {
    return (
      <div className="min-h-screen bg-slate-50">
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
                  {deck?.description || 'No description'}
                </ReactMarkdown>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2"
              >
                ← Back to previous page
              </button>
            </div>
          </div>
        </main >
      </div >
    )
  }
}
