import Link from 'next/link'
import { BUG_REPORT_URL, CONTACT_EMAIL } from '@/lib/constants'

export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                <p>Hanzi Hub is a student project. It is not affiliated with DLI, Anki or Pleco.</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <Link href="/tutorials" className="hover:text-slate-900 dark:hover:text-white">Tutorials</Link>
                    <a href={BUG_REPORT_URL} className="hover:text-slate-900 dark:hover:text-white">Report a bug</a>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-slate-900 dark:hover:text-white">Contact</a>
                </div>
            </div>
        </footer>
    )
}
