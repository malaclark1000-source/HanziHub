// Switches between the Anki and Pleco tutorials
//

import Link from 'next/link'

const TABS = [
    { href: '/tutorials', label: 'Anki' },
    { href: '/tutorials/pleco', label: 'Pleco' },
]

export function TutorialTabs({ current }: { current: string }) {
    return (
        <div className="inline-flex gap-1 p-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {TABS.map(tab => (
                <Link key={tab.href} href={tab.href}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${current === tab.href ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>
                    {tab.label}
                </Link>
            ))}
        </div>
    )
}
