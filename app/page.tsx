'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './utils/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/decks')
      } else {
        router.replace('/auth/login')
      }
    }
    checkSession()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  )
}
