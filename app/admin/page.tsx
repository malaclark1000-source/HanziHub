'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Deck } from '../utils/supabase'

const CATEGORIES = [
  'Core',
  'Supplementary',
  'Collection',
]

function Header({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }
  const navLinks = (mobile?: boolean) => (
    <>
      <Link href="/decks" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>Browse Decks</Link>
      <Link href="/dashboard" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>My Downloads</Link>
      <Link href="/admin" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 font-medium whitespace-nowrap' : 'text-purple-600 font-medium'}>Admin</Link>
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

async function uploadToR2(file: File, deckName: string, onStatus: (msg: string) => void): Promise<string> {
  onStatus('Requesting upload URL...')
  const contentType = file.type || 'application/octet-stream'
  const res = await fetch('/api/r2-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType, deckName }),
  })
  if (!res.ok) throw new Error('Failed to get upload URL')
  const { uploadUrl, publicUrl, contentDisposition } = await res.json()
  onStatus('Uploading file...')
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType,
      ...(contentDisposition ? { 'Content-Disposition': contentDisposition } : {}),
    },
  })
  if (!uploadRes.ok) throw new Error('File upload failed')
  onStatus('Upload complete!')
  return publicUrl
}

function CreateDeckForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [version, setVersion] = useState('1.0')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Please select a file.'); return }
    setError('')
    setLoading(true)
    try {
      const fileUrl = await uploadToR2(file, name, setStatus)
      setStatus('Creating deck record...')
      const { error: dbError } = await supabase.from('decks').insert({
        name, description, category, current_version: version, file_url: fileUrl, download_count: 0,
      })
      if (dbError) throw new Error(dbError.message)
      setStatus('Deck created successfully!')
      setName(''); setDescription(''); setCategory(''); setVersion('1.0'); setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      onCreated()
      setTimeout(() => setStatus(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Deck</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {status && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">{status}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deck Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select a category --</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Version</label>
            <input value={version} onChange={e => setVersion(e.target.value)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deck File (.apkg)</label>
            <input ref={fileRef} type="file" accept=".apkg,.zip" onChange={e => setFile(e.target.files?.[0] || null)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-slate-100 file:text-slate-700" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors">
          {loading ? 'Creating...' : 'Create Deck'}
        </button>
      </form>
    </div>
  )
}

function UpdateDeckForm({ decks, onUpdated }: { decks: Deck[]; onUpdated: () => void }) {
  const [selectedId, setSelectedId] = useState('')
  const [version, setVersion] = useState('')
  const [changelog, setChangelog] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Please select a file.'); return }
    if (!selectedId) { setError('Please select a deck.'); return }
    setError('')
    setLoading(true)
    try {
      const selectedDeck = decks.find(d => d.id === selectedId)
      const fileUrl = await uploadToR2(file, selectedDeck?.name || '', setStatus)
      setStatus('Updating deck...')
      const { error: dbError } = await supabase.from('decks').update({
        current_version: version, file_url: fileUrl, updated_at: new Date().toISOString(),
      }).eq('id', selectedId)
      if (dbError) throw new Error(dbError.message)
      await supabase.from('deck_versions').insert({
        deck_id: selectedId, version, changelog, file_url: fileUrl,
      })
      setStatus('Sending update notifications...')
      await fetch('/api/notify-deck-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: selectedId, deckName: selectedDeck?.name, version, changelog }),
      })
      setStatus('Deck updated successfully!')
      setSelectedId(''); setVersion(''); setChangelog(''); setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      onUpdated()
      setTimeout(() => setStatus(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Update Existing Deck</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {status && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">{status}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Deck</label>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">-- Select a deck --</option>
            {decks.map(d => (
              <option key={d.id} value={d.id}>{d.name} (v{d.current_version})</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Version</label>
            <input value={version} onChange={e => setVersion(e.target.value)} required placeholder="e.g. 1.1"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New File (.apkg)</label>
            <input ref={fileRef} type="file" accept=".apkg,.zip" onChange={e => setFile(e.target.files?.[0] || null)} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-slate-100 file:text-slate-700" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Changelog</label>
          <textarea value={changelog} onChange={e => setChangelog(e.target.value)} rows={2}
            placeholder="What changed in this version?"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors">
          {loading ? 'Updating...' : 'Update Deck'}
        </button>
      </form>
    </div>
  )
}

function SendNotificationForm({ decks }: { decks: Deck[] }) {
  const [selectedId, setSelectedId] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedId) { setError('Please select a deck.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/notify-deck-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: selectedId, subject, message }),
      })
      const { sent } = await res.json()
      setStatus(`Sent to ${sent} subscriber${sent !== 1 ? 's' : ''}.`)
      setSelectedId(''); setSubject(''); setMessage('')
      setTimeout(() => setStatus(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Send Notification</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {status && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">{status}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deck</label>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">-- Select a deck --</option>
            {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors">
          {loading ? 'Sending...' : 'Send to Subscribers'}
        </button>
      </form>
    </div>
  )
}

function DeckList({ decks, onRefresh }: { decks: Deck[]; onRefresh: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startEdit(deck: Deck) {
    setEditingId(deck.id)
    setEditName(deck.name)
    setEditDesc(deck.description)
    setEditCategory(deck.category)
    setError('')
  }

  async function saveEdit(id: string) {
    setSaving(true)
    setError('')
    try {
      const { error: dbError } = await supabase.from('decks').update({ name: editName, description: editDesc, category: editCategory }).eq('id', id)
      if (dbError) throw new Error(dbError.message)
      setEditingId(null)
      onRefresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setError('')
    try {
      await supabase.from('user_downloads').delete().eq('deck_id', id)
      await supabase.from('deck_versions').delete().eq('deck_id', id)
      const { error: dbError } = await supabase.from('decks').delete().eq('id', id)
      if (dbError) throw new Error(dbError.message)
      onRefresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Manage Decks ({decks.length})</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <div className="space-y-3">
        {decks.map(deck => (
          <div key={deck.id} className="border border-slate-200 rounded-lg p-4">
            {editingId === deck.id ? (
              <div className="space-y-3">
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm" />
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                  <option value="">-- Select a category --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(deck.id)} disabled={saving}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="px-4 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{deck.name}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">v{deck.current_version}</span>
                    <span className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full">{deck.category}</span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{deck.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{deck.download_count} downloads</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(deck)}
                    className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${deck.name}"? This cannot be undone.`)) handleDelete(deck.id)
                    }}
                    disabled={deletingId === deck.id}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors">
                    {deletingId === deck.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {decks.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-4">No decks yet.</p>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [unauthorized, setUnauthorized] = useState(false)

  async function loadDecks() {
    const { data } = await supabase.from('decks').select('*').order('name')
    setDecks(data || [])
  }

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth/login'); return }
      const email = session.user.email || ''
      setUserEmail(email)
      // Check admin access via server-side API (reads ADMIN_EMAILS env var at runtime)
      const res = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const { isAdmin } = await res.json()
      if (!isAdmin) {
        setUnauthorized(true)
        setLoading(false)
        return
      }
      await loadDecks()
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading...</div>

  if (unauthorized) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 mb-4">You don&apos;t have permission to access the admin panel.</p>
        <Link href="/decks" className="text-blue-600 hover:text-blue-700 font-medium">Back to Decks</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userEmail={userEmail} />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        </div>
        <CreateDeckForm onCreated={loadDecks} />
        <UpdateDeckForm decks={decks} onUpdated={loadDecks} />
        <SendNotificationForm decks={decks} />
        <DeckList decks={decks} onRefresh={loadDecks} />
      </main>
    </div>
  )
}
