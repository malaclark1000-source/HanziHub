'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../utils/supabase'
import { Header } from '@/components/layout/Header'
import { NotificationModal } from '@/components/layout/NotificationModal'


export default function ReportBugPage() {
  const router = useRouter()
  const [decks, setDecks] = useState<{ id: string; name: string }[]>([])
  const [selectedDeck, setSelectedDeck] = useState('')
  const [description, setDescription] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth/login'); return }
      setUserEmail(session.user.email || '')
      setContactEmail(session.user.email || '')
      const adminRes = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      })
      const { isAdmin: admin } = await adminRes.json()
      setIsAdmin(admin)
      const { data } = await supabase.from('decks').select('id, name').order('name')
      setDecks(data || [])
    }
    init()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) { setError('Please describe the issue.'); return }
    setError('')
    setLoading(true)
    try {
      const { error: dbError } = await supabase.from('bug_reports').insert({
        deck_id: selectedDeck || null,
        description: description.trim(),
        contact_email: contactEmail.trim() || null,
        submitted_at: new Date().toISOString(),
      })
      if (dbError) {
        console.warn('bug_reports table error:', dbError.message)
      }
      const deckName = decks.find(d => d.id === selectedDeck)?.name || ''
      await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckName, description: description.trim(), contactEmail: contactEmail.trim() }),
      })
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Report a Bug</h1>
          <p className="text-slate-500 text-sm">Found an issue with a deck? Let us know.</p>
        </div>

        {success ? (
          <div className="bg-white rounded-xl border border-green-200 p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Report submitted!</h2>
            <p className="text-slate-500 text-sm mb-6">Thank you for your feedback. We&apos;ll look into it.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSuccess(false); setDescription(''); setSelectedDeck(''); }}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Submit another
              </button>
              <Link href="/decks" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Back to Decks
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Which deck? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <select
                  value={selectedDeck}
                  onChange={e => setSelectedDeck(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">General / Not deck-specific</option>
                  {decks.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">What&apos;s wrong?</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={5}
                  required
                  placeholder="Describe the issue in as much detail as possible. For Single Characters by Frequency include frequency number, for Curriculum vocab include Unit, Lesson, Presentation, etc..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contact email <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
