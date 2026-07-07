'use client'
// Zustand store for managing deck state.
//
// Built following https://zustand.docs.pmnd.rs/learn/guides/nextjs as a guide.
//
// 1. Define a State object
// 2. Define an initial state for that entire State object
// 3. Use `createStore` hook to make our _own_ `createStateStore` hook.
import { createStore } from 'zustand/vanilla'
import { Deck, User } from '@/types/types'
import { supabase } from '@/app/utils/supabase'
import { useRouter } from 'next/navigation'
import { checkAdminStatus } from '@/lib/admin'
import { checkNotificationPrefs } from '@/lib/notifications'

// Step 1, define a store object
export type ApplicationState = {
  decks: Deck[]
  user: User | undefined
  isLoading: boolean
  error: string | null
}

export type ApplicationActions = {
  loadDecks: (forceReload: boolean) => Promise<void>
  loadUser: (router: ReturnType<typeof useRouter>) => Promise<void>
  resetUser: () => void
}

export type ApplicationStore = ApplicationState & ApplicationActions

// Step 2, create a default state object (this could have been done inline)
export const defaultInitState: ApplicationState = {
  decks: [],
  user: undefined,
  isLoading: true,
  error: null
}

// Step 3, create our own hook that our application can use
export const createApplicationStore = (
  initState: ApplicationState = defaultInitState,
) => {
  return createStore<ApplicationStore>()((set, get) => ({
    ...initState,

    resetUser: async () => {
      console.log("Resetting user!")
      set({ user: undefined })
    },

    // User authentification
    loadUser: async (router) => {

      // Check if our user already exists
      const currentUser = get().user
      if (currentUser !== undefined) {
        return
      }

      // Try and connect to supabase
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/auth/login')
          return
        }

        set({
          user: {
            userId: session.user.id,
            userEmail: session.user.email || "",
            isAdmin: await checkAdminStatus(session.access_token),
            hasRespondedNotifications: await checkNotificationPrefs(session.user.id) || false
          }
        })
      } catch (error) {
        console.log("Caught supabase error.")
        console.log(JSON.stringify(router))
        router.push('/auth/login')
      }
    },

    // Retrieve a list of decks from our database
    loadDecks: async (forceReload: boolean = false) => {
      try {

        // Return loaded decks if they've already been loaded
        const currentDecks = get().decks
        if (currentDecks.length > 0 && !forceReload) {
          return
        }


        // Otherwise retrieve decks from supabase
        const { data } = await supabase
          .from('decks')
          .select('*')
          .order('name') as { data: Deck[] }

        // Update our store.
        set({ decks: data || [], isLoading: false })
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false })
      }
    }

  }))
}
