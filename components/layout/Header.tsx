import { supabase } from '../../app/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from './NavBar';
import { useApplicationStore } from '@/providers/application-store-provider';

export function Header({ onBellClick, userEmail, isAdmin }: { onBellClick: () => void; userEmail: string; isAdmin: boolean }) {

    const router = useRouter()
    const resetUser = useApplicationStore((store) => store.resetUser)

    async function handleLogout() {
        await supabase.auth.signOut()
        // Wipe our user from the zustand store
        resetUser()
        router.push('/auth/login')
    }
    const navLinks = (mobile?: boolean) => (
        NavBar(
            isAdmin,
            mobile
        )
    )
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/decks" className="text-xl font-bold text-slate-900">汉字 Hub</Link>
                    <nav className="hidden sm:flex gap-4 text-sm">{navLinks()}</nav>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onBellClick} title="Notification preferences" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">🔔</button>
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
