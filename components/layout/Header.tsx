import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/app/utils/supabase'
import { useApplicationStore } from '@/providers/application-store-provider';
import { NotificationModal } from './NotificationModal';
import { NavBar } from './NavBar';
import { usePathname } from 'next/navigation';

export function Header() {

    // Component state
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()
    const { user, loadUser, resetUser } = useApplicationStore((store) => store)

    const pathName = usePathname()
    const currentPage = pathName.split('/').at(1) || ''

    // Load user to populate nav bar with admin + user email
    useEffect(() => {
        async function init() {
            await loadUser(router)
        }
        init()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        // Wipe our user from the zustand store
        resetUser()
        router.push('/auth/login')
    }


    if (user) {
        // Show notication modal if a user hasn't set their preferences
        if (!user.hasRespondedNotifications && !showModal) {
            setShowModal(true)
        }

        const navLinks = (mobile?: boolean) => (
            NavBar(
                currentPage,
                user.isAdmin,
                mobile
            )
        )

        // If user isn't set, wait for component to rerender
        return (
            <>
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/decks" className="text-xl font-bold text-slate-900">汉字 Hub</Link>
                            <nav className="hidden sm:flex gap-4 text-sm">{navLinks()}</nav>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowModal(true)} title="Notification preferences" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">🔔</button>
                            <span className="hidden sm:block text-sm text-slate-500">{user.userEmail}</span>
                            <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Sign out</button>
                        </div>
                    </div>
                    <div className="sm:hidden border-t border-slate-100">
                        <nav className="flex gap-1 px-4 py-2 overflow-x-auto">{navLinks(true)}</nav>
                    </div>
                </header>
                {
                    showModal && (
                        <NotificationModal
                            userEmail={user.userEmail}
                            onClose={() => {
                                setShowModal(false)
                                user.hasRespondedNotifications = true
                            }}
                        />
                    )
                }
            </>
        )


    } else {
        return <Suspense />
    }


}
