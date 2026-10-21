import { Metadata } from 'next'
import { TutorialTabs } from '@/components/tutorials/TutorialTabs'
import { BUG_REPORT_URL, CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Pleco Tutorial',
  description: 'How to import a Hanzi Hub Pleco deck into Pleco, with the recommended import settings.',
}

// Recommended Pleco import settings. `changed` marks settings that likely
// differ from Pleco's defaults.
const IMPORT_SETTINGS = [
  {
    group: 'File Format',
    settings: [
      { name: 'Text encoding', value: 'UTF-8' },
    ],
  },
  {
    group: 'Definitions',
    settings: [
      { name: 'Definition source', value: 'Prefer File', changed: true },
      { name: 'Dictionaries', value: 'All dicts' },
      { name: 'Store in user dict', value: 'Up to you' },
    ],
  },
  {
    group: 'Problem Handling',
    settings: [
      { name: 'Fill in missing fields', value: 'Selected', note: 'Automatically adds the traditional/simplified character to the appropriate field of a flashcard if it was left blank. It won’t make a difference in the Semester sets.' },
      { name: 'Missing entries', value: 'Create blank' },
      { name: 'Ambiguous entries', value: 'Prompt' },
      { name: 'Duplicate entries', value: 'Allow', changed: true },
    ],
  },
]

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h2>
          <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-3">{children}</div>
        </div>
      </div>
    </section>
  )
}

export default function PlecoTutorialPage() {

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="max-w-3xl mx-auto px-4 py-10">
        <TutorialTabs current="/tutorials/pleco" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Pleco Tutorial</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">How to import a Hanzi Hub Pleco deck (.txt) into Pleco&apos;s flashcards, step by step.</p>

        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
          <p className="font-semibold mb-1">Read this before importing</p>
          <p>
            The Semester 1, 2 and 3 flashcard definitions are imported from the curriculum glossaries. Use the settings in Step 4 so your flashcards exactly match the definitions given in the curriculum.
            Setting <span className="font-semibold">Duplicate entries</span> to anything other than <span className="font-semibold">Allow</span> will cause Pleco to change or merge the flashcard definitions with a default definition from its choice of dictionary. That&apos;s not ideal when you&apos;re studying for the unit test.
          </p>
        </div>

        <div className="space-y-4">
          <Step number={1} title="Install Pleco">
            <p>Install the Pleco Chinese Dictionary app on your phone from the App Store (iPhone) or Google Play (Android) and open it once so it finishes setting up.</p>
          </Step>

          <Step number={2} title="Download the deck to your phone">
            <p>Go to the Pleco Decks page on Hanzi Hub and tap <span className="font-semibold">Download</span> on the deck you want. The deck is a plain .txt file.</p>
            <div>
              <p className="font-semibold">iPhone</p>
              <p>Safari saves the file to your Downloads folder in the Files app. If Safari opens a preview of the text instead, tap the Share button and choose <span className="font-semibold">Save to Files</span>.</p>
            </div>
            <div>
              <p className="font-semibold">Android</p>
              <p>The file is saved to your Downloads folder.</p>
            </div>
          </Step>

          <Step number={3} title="Open Pleco's import screen and choose the file">
            <ol className="list-decimal list-inside space-y-1">
              <li>In Pleco, open the main menu (the button in the top-left corner).</li>
              <li>Go to <span className="font-semibold">Flashcards → Import / Export → Import Cards</span>.</li>
              <li>Tap <span className="font-semibold">File</span> and select the .txt file you just downloaded from your Downloads folder.</li>
            </ol>
          </Step>

          <Step number={4} title="Use the recommended import settings">
            <p>Before you tap Import, set the options on the import screen as follows. Settings marked <span className="font-semibold text-blue-700 dark:text-blue-300">*</span> are likely different from Pleco&apos;s defaults, so double-check those.</p>
            <div className="space-y-4">
              {IMPORT_SETTINGS.map(group => (
                <div key={group.group}>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{group.group}</p>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800">
                    {group.settings.map(s => (
                      <div key={s.name} className="px-4 py-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-600 dark:text-slate-300">{s.name}</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                            {s.value}{s.changed && <span className="text-blue-700 dark:text-blue-300">*</span>}
                          </span>
                        </div>
                        {s.note && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p>
              The two that matter most are <span className="font-semibold">Definition source: Prefer File</span>, which keeps the curriculum&apos;s definitions instead of Pleco&apos;s dictionary definitions,
              and <span className="font-semibold">Duplicate entries: Allow</span>, which stops Pleco from merging your cards with ones it already has.
            </p>
          </Step>

          <Step number={5} title="Import">
            <p>Tap <span className="font-semibold">Import</span>. Pleco will add the cards and tell you how many were imported. If a word matches more than one dictionary entry, Pleco will ask you which one you mean, because Ambiguous entries is set to Prompt.</p>
          </Step>

          <Step number={6} title="Start studying">
            <p>Your new cards are in Pleco&apos;s flashcard system. Go to <span className="font-semibold">Flashcards</span> in the main menu, start a study session, and pick the deck&apos;s category as the cards to test on.</p>
          </Step>
        </div>

        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
          This tutorial is maintained by Hanzi Hub. If something has changed in a recent Pleco update or you spot an error,{' '}
          <a href={BUG_REPORT_URL} className="text-blue-600 dark:text-blue-400 hover:underline">report it</a> using the link at the top of the page or email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 dark:text-blue-400 hover:underline">{CONTACT_EMAIL}</a>.
        </p>
      </main>
    </div>
  )
}
