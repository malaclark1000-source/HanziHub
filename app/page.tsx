import Link from 'next/link'
import { HANZI_HUB_STARTER_PACK_ID } from '@/lib/constants'

const APP_CHOICES = [
  {
    app: 'Anki',
    href: '/decks',
    tutorial: '/tutorials',
    summary: 'A full spaced-repetition system. Anki schedules every card for you and works on desktop, iPhone and Android.',
    bestFor: 'Best if you want Anki to plan your reviews for you every day.',
  },
  {
    app: 'Pleco',
    href: '/pleco-decks',
    tutorial: '/tutorials/pleco',
    summary: 'The Chinese dictionary app most students already have. Import a word list and drill it with Pleco’s built-in flashcards.',
    bestFor: 'Best if you want quick vocab review on your phone, matching the curriculum glossaries.',
  },
]

// Landing page: who the site is for, and a choice between Anki and Pleco
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">汉字 Hub</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Free flashcard decks, tutorials and tools for DLI Mandarin students. Pick the app you study with to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {APP_CHOICES.map(choice => (
            <div key={choice.app} className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col focus-within:ring-2 focus-within:ring-blue-500">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                <Link href={choice.href} className="after:absolute after:inset-0 focus:outline-none">
                  Study with {choice.app}
                </Link>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">{choice.summary}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{choice.bestFor}</p>
              <div className="mt-auto flex items-center justify-between gap-4">
                <span className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Browse {choice.app} decks →</span>
                <Link href={choice.tutorial} className="relative z-10 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Read the tutorial
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">New here?</p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Start with the Starter Pack</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Every Hanzi Hub Anki deck in one download.</p>
          </div>
          <Link href={`/decks/${HANZI_HUB_STARTER_PACK_ID}`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center whitespace-nowrap">
            Get the Starter Pack
          </Link>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Looking for more? See the <Link href="/external-tools" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">external tools</Link> other DLI students recommend.
        </p>
      </main>
    </div>
  )
}
