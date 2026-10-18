import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { NavBar } from './NavBar';
import { useAdminSession } from '@/lib/useAdminSession';

export function Header() {

    const pathName = usePathname()
    const currentPage = pathName.split('/').at(1) || ''
    const showAdmin = useAdminSession().isAdmin === true

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/decks" className="text-xl font-bold text-slate-900">汉字 Hub</Link>
                    <nav className="hidden sm:flex gap-4 text-sm">{NavBar(currentPage, showAdmin, false)}</nav>
                </div>
            </div>
            <div className="sm:hidden border-t border-slate-100">
                <nav className="flex gap-1 px-4 py-2 overflow-x-auto">{NavBar(currentPage, showAdmin, true)}</nav>
            </div>
        </header>
    )
}
