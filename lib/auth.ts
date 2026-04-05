import { supabase } from "@/app/utils/supabase"
import { NextRouter } from "next/router"

// lib/auth.ts
export async function getSessionOrRedirect(router: NextRouter) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) router.replace('/auth/login')
  return session
}
