'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabase'
import { Header } from '@/components/layout/Header'
import { NotificationModal } from '@/components/layout/NotificationModal'


export default function TutorialsPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showModal, setShowModal] = useState(false)

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
    }
    init()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 text-center">
      <Header onBellClick={() => setShowModal(true)} userEmail={userEmail} isAdmin={isAdmin} />
      {showModal && (
        <NotificationModal
          userEmail={userEmail}
          onClose={() => setShowModal(false)}
        />
      )}
      Tutorials will be uploaded soon!
    </div>
  )
}
