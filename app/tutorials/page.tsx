'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../utils/supabase'

function Header({ userEmail, isAdmin }: { userEmail: string; isAdmin: boolean }) {
  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }
  const navLinks = (mobile?: boolean) => (
    <>
      <Link href="/decks" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>Browse Decks</Link>
      <Link href="/dashboard" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>My Downloads</Link>
      <Link href="/tutorials" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-medium whitespace-nowrap' : 'text-blue-600 font-medium'}>Tutorials</Link>
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

export default function TutorialsPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth/login'); return }
      setUserEmail(session.user.email ?? '')
      fetch('/api/check-admin').then(r => r.json()).then(d => setIsAdmin(d.isAdmin))
    })
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userEmail={userEmail} isAdmin={isAdmin} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Tutorials</h1>
        <p className="text-slate-500 mb-8">Learn how to get the most out of HanziHub and Anki.</p>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Getting Started with Anki</h2>
            <p className="text-slate-500 text-sm">Tutorial content coming soon. This will cover how to download and install Anki, import decks, and configure your study settings.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">How to Download and Import a Deck</h2>
            <p className="text-slate-500 text-sm">Tutorial content coming soon. Step-by-step instructions for finding a deck on HanziHub, downloading it, and importing it into Anki.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Study Tips for Mandarin</h2>
            <p className="text-slate-500 text-sm">Tutorial content coming soon. Best practices for using spaced repetition to learn characters, vocabulary, and tones effectively.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
