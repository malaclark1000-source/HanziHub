// Custom provider that provides all components with access to our decks.
//
// Here we are using the React hook `createContext` in order to expose our store
// to _any_ child component without having to explicitly pass in the store as a property.
'use client'

import { type ReactNode, createContext, useState, useContext } from 'react'
import { useStore } from 'zustand'

import { type ApplicationStore, createApplicationStore } from '@/stores/application-store'

export type ApplicationStoreApi = ReturnType<typeof createApplicationStore>

export const ApplicationStoreContext = createContext<ApplicationStoreApi | undefined>(
    undefined,
)

export interface ApplicationStoreProviderProps {
    children: ReactNode
}

// Our actual React component that we will use to wrap other components with.
export const ApplicationStoreProvider = ({
    children,
}: ApplicationStoreProviderProps) => {
    const [store] = useState(() => createApplicationStore())
    return (
        <ApplicationStoreContext.Provider value={store}>
            {children}
        </ApplicationStoreContext.Provider>
    )
}

export const useApplicationStore = <T,>(
    selector: (store: ApplicationStore) => T,
): T => {
    const counterStoreContext = useContext(ApplicationStoreContext)
    if (!counterStoreContext) {
        throw new Error(`useApplicationStore must be used within ApplicationStoreProvider`)
    }

    return useStore(counterStoreContext, selector)
}

export const useApplicationStoreApi = () => {
    const store = useContext(ApplicationStoreContext)
    if (!store) throw new Error('Missing provider')
    return store
}
