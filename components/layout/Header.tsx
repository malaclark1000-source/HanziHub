import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { NavBar } from './NavBar';
import { useAdminSession } from '@/lib/useAdminSession';
import { BUG_REPORT_URL } from '@/lib/constants';

export function Header() {

    const pathName = usePathname()
    const currentPage = pathName.split('/').at(1) || ''
    const showAdmin = useAdminSession().isAdmin === true

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold text-slate-900 dark:text-slate-100">汉字 Hub</Link>
                    <nav className="hidden sm:flex gap-4 text-sm">{NavBar(currentPage, showAdmin, false)}</nav>
                </div>
                <a href={BUG_REPORT_URL} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white whitespace-nowrap">Report a bug</a>
            </div>
            <div className="sm:hidden border-t border-slate-100 dark:border-slate-800">
                <nav className="flex gap-1 px-4 py-2 overflow-x-auto">{NavBar(currentPage, showAdmin, true)}</nav>
            </div>
        </header>
    )
}
