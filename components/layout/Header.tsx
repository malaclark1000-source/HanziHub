import { supabase, type Deck } from '../../app/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function Header({ onBellClick, userEmail, isAdmin }: { onBellClick: () => void; userEmail: string; isAdmin: boolean }) {
    const router = useRouter()
    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/auth/login')
    }
    const navLinks = (mobile?: boolean) => (
        <>
            <Link href="/decks" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-medium whitespace-nowrap' : 'text-blue-600 font-medium'}>Browse Decks</Link>
            <Link href="/dashboard" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>My Downloads</Link>
            <Link href="/tutorials" className={mobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'}>Tutorials</Link>
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
