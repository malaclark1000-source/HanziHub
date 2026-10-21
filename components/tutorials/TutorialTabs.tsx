// Switches between the Anki and Pleco tutorials
//

import Link from 'next/link'

const TABS = [
    { href: '/tutorials', label: 'Anki' },
    { href: '/tutorials/pleco', label: 'Pleco' },
]

export function TutorialTabs({ current }: { current: string }) {
    return (
        <div className="inline-flex gap-1 p-1 mb-6 bg-slate-100 rounded-lg">
            {TABS.map(tab => (
                <Link key={tab.href} href={tab.href}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${current === tab.href ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                    {tab.label}
                </Link>
            ))}
        </div>
    )
}
