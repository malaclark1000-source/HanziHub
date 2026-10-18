'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/app/utils/supabase'
import { checkAdminStatus } from '@/lib/admin'

// Tracks the current Supabase session and whether it belongs to an admin.
//
// session: `undefined` while restoring, `null` when signed out
// isAdmin: `null` until verified for the current session
//
// Public visitors have no session, so this never touches the network for them.
export function useAdminSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  // Follow sign in, sign out and token refresh. Supabase calls must not be
  // awaited inside this callback, so the admin check runs in the effect below.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') setIsAdmin(null)
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Admin access is verified server-side from the session token itself
  // (never from a client-supplied email) — see /api/check-admin.
  const accessToken = session?.access_token
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    checkAdminStatus(accessToken).then(admin => {
      if (!cancelled) setIsAdmin(admin)
    })
    return () => { cancelled = true }
  }, [accessToken])

  return { session, accessToken, isAdmin }
}
