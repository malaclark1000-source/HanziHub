'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabase'
import { Header } from '@/components/layout/Header'
import { NotificationModal } from '@/components/layout/NotificationModal'

const sections = [
  {
    title: '1. What Is Anki & Why It Works',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">What is Anki?</p>
          <p>Anki is a free flashcard app built on the science of how your brain actually retains information — it shows you the right card at the right moment, right before you'd forget it.</p>
        </div>
        <div>
          <p className="font-semibold">What is Spaced Repetition (SRS)?</p>
          <p>Spaced repetition is the practice of reviewing information at increasing intervals over time. Here's a concrete example: you learn the word 机会 (opportunity) today. Without Anki, you might review it ten times in a row tonight and forget it by Thursday. With Anki, you see it again tomorrow, then in three days, then in a week, then in three weeks — each time you remember it, Anki pushes the next review further out. You spend less time on what you know and more time on what you're actually forgetting.</p>
        </div>
        <div>
          <p className="font-semibold">The Forgetting Curve</p>
          <p>In the 1880s, psychologist Hermann Ebbinghaus discovered that without review, we forget roughly 70% of new information within 24 hours. The curve is steep and brutal. Every time you successfully recall something, the curve flattens — your brain treats it as more important and holds onto it longer. Anki's entire engine is built around exploiting this: it catches you right before the drop-off and resets the curve upward.</p>
        </div>
        <div>
          <p className="font-semibold">What Does the Research Say?</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Studies consistently show that spaced repetition produces stronger long-term retention than massed practice (cramming) — often 2–5x more efficient for the same time investment.</li>
            <li>Active recall — the act of pulling information from memory rather than passively rereading — is one of the single most effective learning strategies identified in cognitive science.</li>
            <li>Combining spaced repetition with active recall (exactly what Anki does) produces the best retention outcomes of any self-study method studied to date.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: '2. Why Anki Matters Specifically at DLI',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">The Volume Problem</p>
          <p>DLI throws vocabulary at you at a pace that no normal study method was designed to handle. You're not learning 10–20 words a week like a typical language class — you're expected to absorb thousands of characters, words, and phrases per semester, while simultaneously developing listening, reading, and speaking skills. Conventional methods (re-reading notes, making paper flashcards, highlighting) collapse under this volume. Anki doesn't.</p>
        </div>
        <div>
          <p className="font-semibold">Efficiency Over Effort</p>
          <p>The goal at DLI is not to study more — it's to study smarter. You can spend four hours a night re-reading vocabulary lists and still tank your DLPT because passive review doesn't build the retrieval pathways you need under pressure. Twenty focused minutes with Anki — actively recalling, honestly rating yourself, letting the algorithm work — produces deeper retention than hours of passive exposure.</p>
        </div>
        <div>
          <p className="font-semibold">The Cumulative Advantage</p>
          <p>Students who start using Anki consistently from week one are in a completely different position by DLPT time. The system compounds: cards reviewed consistently over months become deeply encoded, almost automatic. Students who wait until the final stretch are fighting both new material and the entire backlog of what they've already forgotten. Starting early isn't just helpful — it's the difference between review feeling manageable and review feeling impossible.</p>
        </div>
        <div>
          <p className="font-semibold">The Connection to FLPP and Your Score Goals</p>
          <p>Your DLPT score directly determines your Foreign Language Proficiency Pay. The gap between a 2/2 and a 3/3 — or a 3/3 and a 3+/3+ — is not just a matter of talent. It is largely a matter of vocabulary depth and automaticity. Anki builds exactly that. Every card you keep current is one fewer word you'll blank on under test conditions. Treat your Anki deck like a retirement account: consistent small deposits over time, and the payoff is real.</p>
        </div>
      </div>
    ),
  },
  {
    title: '3. Create Your Account & Sync Across Devices',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Create a Free AnkiWeb Account</p>
          <p>Go to ankiweb.net and click "Sign Up." You just need an email address and password. This account is what ties all your devices together — your progress on your phone syncs to your laptop and vice versa. Do this before you do anything else.</p>
        </div>
        <div>
          <p className="font-semibold">Download the App</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li><span className="font-medium">Android:</span> Download AnkiDroid from the Google Play Store. It's free.</li>
            <li><span className="font-medium">iPhone:</span> Download AnkiMobile from the App Store. It costs a few dollars and is the only purchase you'll need to make — it's worth it.</li>
            <li><span className="font-medium">Desktop:</span> Your issued tech comes with Anki pre-installed.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">How to Sync — And When</p>
          <p>Syncing is simple: open Anki, tap or click the sync button (the cloud icon), and wait for it to complete. The rule is: sync before you start a session and sync when you finish. This ensures your progress is always backed up and your devices stay aligned.</p>
        </div>
        <div>
          <p className="font-semibold">Common Sync Pitfalls</p>
          <p>The most common problem: you review 80 cards on your phone during lunch, forget to sync, then open your laptop in the evening and sync from there — now your laptop's stale state overwrites your phone's progress and those 80 reviews disappear. Always sync both before and after every session. If you find your devices are out of sync, Anki will ask you which version to keep — choose the one with the most recent review activity, then immediately sync both devices before touching anything else.</p>
        </div>
      </div>
    ),
  },
  {
    title: '4. Importing Decks Downloaded from Hanzi Hub',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Desktop Import Walkthrough</p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Download the deck file (.apkg) from Hanzi Hub.</li>
            <li>Open Anki on your computer.</li>
            <li>Go to File → Import and select the downloaded file, or simply double-click the .apkg file — Anki will open and begin importing automatically.</li>
            <li>A dialog box will appear with import options.</li>
          </ol>
        </div>
        <div>
          <p className="font-semibold">iPhone Import Walkthrough</p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Download the .apkg file on your iPhone. If you're downloading directly in Safari, tap the file and choose "Open in AnkiMobile."</li>
            <li>AnkiMobile will automatically begin the import process.</li>
            <li>Alternatively, you can download the file to your iCloud Drive or Files app, then open AnkiMobile and import from there via the Add/Import option.</li>
          </ol>
        </div>
        <div>
          <p className="font-semibold">Android Import Walkthrough</p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Download the .apkg file to your Android device.</li>
            <li>Open AnkiDroid, tap the menu (three dots or the hamburger icon), and select Import.</li>
            <li>Navigate to your Downloads folder, select the file, and confirm.</li>
          </ol>
        </div>
        <div>
          <p className="font-semibold">Critical Import Settings</p>
          <p>When the import dialog appears, always make sure:</p>
          <ul className="list-none space-y-1 mt-1">
            <li>✅ Import presets is checked — this brings in the deck's recommended settings.</li>
            <li>❌ Import progress is NOT checked.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">After Import</p>
          <p>The deck will appear in your main deck list. New cards will show as unlearned (blue number). Don't panic if the card count looks overwhelming — you'll configure how many you see per day in the settings before you start.</p>
        </div>
      </div>
    ),
  },
  {
    title: '5. Card Anatomy — What You\'re Looking At',
    content: (
      <div className="space-y-4">
        <p>Every Hanzi Hub deck is designed for a specific purpose, so card layouts vary between decks. But here's the general anatomy:</p>
        <div>
          <p className="font-semibold">The Front of the Card</p>
          <p>Depending on the deck, the front might show:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>A single Chinese character or word (testing your reading)</li>
            <li>An audio clip (testing your listening recognition)</li>
          </ul>
          <p className="mt-1">The front is the prompt — it's what you're being asked to recall.</p>
        </div>
        <div>
          <p className="font-semibold">The Back of the Card</p>
          <p>After you attempt to recall the answer, you flip the card. The back reveals everything: the character, pinyin, tone marks, English definition, and often example sentences or audio. Compare what you recalled against what's shown here — and be honest.</p>
        </div>
        <div>
          <p className="font-semibold">How to Edit a Card</p>
          <p>Sometimes you want to add a personal memory hook — a mnemonic, a note about how you keep confusing this character with another, or a personal example sentence. To edit:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li><span className="font-medium">Desktop:</span> Click on a card during review and press E, or go to Browse, find the card, and double-click it.</li>
            <li><span className="font-medium">Mobile:</span> Tap the menu during review and select "Edit."</li>
          </ul>
          <p className="mt-1">You can add notes in any empty field, fix typos, or tag cards for custom study sessions. Your edits sync across devices automatically.</p>
        </div>
      </div>
    ),
  },
  {
    title: '6. The SRS Scheduling System & The 4 Buttons',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">How Anki Decides What to Show You</p>
          <p>Anki tracks every card individually. Each card has an "interval" — the number of days until it's due for review again. New cards start with no interval. As you successfully recall a card over multiple sessions, the interval grows: 1 day, then 3 days, then 1 week, then 3 weeks, then 2 months. The algorithm is always optimizing to show you a card as infrequently as possible while keeping it just above your forgetting threshold.</p>
        </div>
        <div>
          <p className="font-semibold">What "Interval" Means</p>
          <p>The interval is simply how many days until Anki shows you that card again. A card with an interval of 21 days won't appear in your reviews for three weeks. A card stuck in early learning might have an interval of only 10 minutes, then 1 day.</p>
        </div>
        <div>
          <p className="font-semibold">The 4 Buttons</p>
          <p>After flipping a card, you rate yourself with one of four buttons:</p>
          <ul className="list-none space-y-2 mt-2">
            <li><span className="font-semibold text-red-600">Again</span> — You didn't remember it, or you got something wrong (wrong tone, wrong meaning, wrong pronunciation). This resets the card back to the beginning of the learning process and puts it in your current session's review queue so you see it again shortly.</li>
            <li><span className="font-semibold text-orange-500">Hard</span> — You remembered it, but it was a real struggle. Anki shortens the next interval compared to what it would have been.</li>
            <li><span className="font-semibold text-green-600">Good</span> — You remembered it comfortably. Anki advances the card on its normal schedule. This is your default button for solid recall.</li>
            <li><span className="font-semibold text-blue-600">Easy</span> — You knew it instantly without any effort. Anki pushes the next interval out significantly further than normal. Use this sparingly.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">The Cardinal Rule: Be Honest</p>
          <p>If you got the tone wrong — press Again. If you got the meaning right but couldn't produce the character — press Again. If you hesitated for more than a few seconds — press Hard at most. The system only works if your ratings reflect reality. Inflating your ratings feels good in the moment and destroys your retention over time.</p>
        </div>
        <div>
          <p className="font-semibold">What Happens Over Time</p>
          <p>A card you consistently hit Good on will have its interval double roughly every review cycle — it will become a card you see every few months without any effort. A card you keep hitting Again on stays in the early learning stages, appearing multiple times per session, until your brain finally encodes it. Both of these outcomes are correct — the system is working exactly as intended.</p>
        </div>
      </div>
    ),
  },
  {
    title: '7. Deck Settings — What to Configure Before You Start',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">How to Access Settings for a Specific Deck</p>
          <p>On desktop, click the gear icon (⚙️) next to a deck name and select Options. On mobile, long-press the deck name and look for Settings or Options. This opens the settings for that deck's preset.</p>
        </div>
        <div>
          <p className="font-semibold">New Cards Per Day</p>
          <p>This is the most important setting and the one most beginners get wrong. The default is 20. For most Hanzi Hub decks, this is too aggressive, especially early on. Every new card you introduce today becomes a review card tomorrow — and the day after, and the day after that. Introducing too many cards at once creates a review avalanche within days that burns people out and causes them to quit.</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><span className="font-medium">Radicals by Frequency / Single Characters by Frequency:</span> Set new cards per day to something manageable — 5 to 10 is a solid range. This feels slow. It isn't. Slow and consistent is what actually works.</li>
            <li><span className="font-medium">UCM Semester Vocabulary Deck:</span> This deck is structured differently (see below) — at the parent deck level, set new cards per day to 0. You'll control new card intake at the presentation level.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">The UCM Semester Deck — How to Approach It</p>
          <p>This is a large deck organized into Units → Lessons → Presentations. Here's the correct workflow:</p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>At the parent deck level, set the preset to 0 new cards per day. This is your safety valve — it prevents any cards from appearing unless you deliberately open them up.</li>
            <li>When you're ready to study a new presentation, expand the deck tree to find that specific presentation deck.</li>
            <li>Click the gear icon on that presentation, go to Options, switch from the shared preset to "This Deck" (so your changes don't affect other presentations), and set new cards per day to 9999. This releases all the cards in that presentation into your review queue at once.</li>
            <li>Study one presentation at a time. Don't jump ahead. If you want to preview upcoming vocab, look at the textbook — don't introduce it into Anki until you're actually studying that presentation in class.</li>
          </ol>
        </div>
        <div>
          <p className="font-semibold">Maximum Reviews Per Day</p>
          <p>Set this to 9999 for all decks. You never want Anki to cut off your reviews mid-session because you hit an arbitrary cap. Let the system show you everything that's due.</p>
        </div>
      </div>
    ),
  },
  {
    title: '8. How to Use Anki at DLI — The Daily Workflow',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">The Core Principle</p>
          <p>Slow and steady beats heroic progress. One student who reviews for 15 consistent minutes every single day will outperform another who does three-hour cramming sessions twice a week — every time, without exception. The algorithm is built for consistency. Feed it consistently.</p>
        </div>
        <div>
          <p className="font-semibold">What a Sustainable Daily Session Looks Like</p>
          <p>If you are current on your reviews, a daily session takes 10 to 20 minutes. That's it. The system is designed to be maintainable. If your sessions are taking an hour or more, you've either added too many new cards too fast, or you've fallen behind and are catching up — both fixable problems.</p>
        </div>
        <div>
          <p className="font-semibold">Do Your Reviews Every Day</p>
          <p>There is no minimum required location or time. Reviews on the bus. Reviews in the DFAC while you eat. Reviews on the toilet. Reviews in the five minutes between classes. Anki on your phone makes this possible — use it. The only rule is: do them every day. Missing days is the single biggest way the system breaks down, because your due cards pile up while you're gone and greet you as an overwhelming wall when you return.</p>
        </div>
        <div>
          <p className="font-semibold">The Compounding Consequence of Skipping</p>
          <p>Let's say you miss three days. Those three days of due reviews don't disappear — they accumulate. If you had 50 cards due per day, you now have 150+ waiting for you, plus today's new ones. Miss a week and the number can climb past 400–500. This is how people fall behind, get overwhelmed, and quit. The fix is prevention: do the reviews every single day, even if it's only 10 minutes, even if you don't feel like it.</p>
        </div>
        <div>
          <p className="font-semibold">Which Decks to Start With</p>
          <ul className="list-disc list-inside space-y-2 mt-1">
            <li><span className="font-medium">Radicals By Frequency / Single Characters By Frequency.</span> Set new cards to 5–10 per day and don't change it. Radicals are the building blocks of every character you'll ever learn — time invested here pays dividends on every new word you encounter for the rest of your time at DLI and beyond.</li>
            <li><span className="font-medium">UCM Semester Deck</span> — One Presentation at a time, keep new cards set to 0 at the parent deck level. When your class moves into a new presentation, go to that specific presentation in the deck tree and open it up (set to 9999 as described above). Study that presentation's cards until you're current and comfortable, then move on. Don't skip ahead, don't try to pre-load a whole unit at once, and don't panic if a presentation has more cards than you expected — the daily review system will spread them out over time.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: '9. Features You Need to Know',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Custom Study</p>
          <p>Custom Study lets you create a temporary review session from a specific subset of your cards — perfect for drilling before a test. To access it: tap or click on a deck, then look for the Custom Study button (on desktop it appears at the bottom of the deck's study screen; on mobile it's in the options). From there you can choose to study cards by tag, by recent mistakes, by a specific interval range, or by cards you've marked. Use this the night before a presentation quiz to hammer just those cards. Note: Custom Study sessions don't interfere with your regular scheduling.</p>
        </div>
        <div>
          <p className="font-semibold">The Browse Screen</p>
          <p>The Browse screen is your bird's-eye view of your entire deck. Access it from the top menu on desktop (Browse) or from the menu in AnkiDroid. From here you can:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Search for specific vocabulary using the search bar</li>
            <li>See the status of every card (new, learning, review, suspended)</li>
            <li>Edit cards in bulk</li>
            <li>Add or remove tags</li>
            <li>Suspend cards you don't need yet (they'll stop appearing in reviews)</li>
            <li>Filter by deck, tag, interval, or due date</li>
          </ul>
          <p className="mt-2">If you're trying to find a specific word, fix a mistake across multiple cards, or understand why a card isn't showing up — the Browse screen is where you go.</p>
        </div>
      </div>
    ),
  },
  {
    title: '10. How to Recover When Things Go Wrong',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Missed a Day or Two — Don't Panic</p>
          <p>Open Anki, look at your due count, take a breath, and start reviewing. You'll have more cards than usual. Work through what you can, cut your new cards down to zero for the next few days until you're caught up, and then ease new cards back in. Two missed days is a bump, not a catastrophe. The system is resilient if you act immediately.</p>
        </div>
        <div>
          <p className="font-semibold">Fell Behind Badly (One to Two Weeks or More)</p>
          <p>This requires a more deliberate reset. You have two main options:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><span className="font-medium">Reset a specific presentation or lesson:</span> Go to Browse, filter by the deck and the cards you want to reset, select them all, then go to Cards → Forget (or Set Due Date). This returns those cards to "new" status and you can reintroduce them at a controlled pace.</li>
            <li><span className="font-medium">Reset an entire deck's progress:</span> Go to the deck, tap the gear/options, and look for "Forget" or "Reset Progress." This wipes all scheduling data for the deck and starts fresh. Use this when a deck has become so backlogged that catching up isn't realistic.</li>
          </ul>
          <p className="mt-2">After any reset, immediately cut your new cards per day back down to a manageable number. The goal is a sustainable daily load — not catching up all at once.</p>
        </div>
      </div>
    ),
  },
  {
    title: '11. Common Mistakes DLI Students Make',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Adding Too Many New Cards at Once</p>
          <p>Especially tempting before a big test or after a break. It feels productive. What it actually does is create a review explosion 3–7 days later that is genuinely unmanageable. Discipline your new card limit and don't touch it when you're feeling anxious about an upcoming exam.</p>
        </div>
        <div>
          <p className="font-semibold">Skipping Reviews and Trying to Catch Up in One Session</p>
          <p>Sitting down to blast through 300 reviews in one sitting destroys your schedule and burns you out. The algorithm doesn't benefit from marathon sessions — it benefits from daily contact. Catch up gradually over several days, not all at once.</p>
        </div>
        <div>
          <p className="font-semibold">Hitting "Easy" on Everything to Feel Good</p>
          <p>This is the feel-good trap. Easy pushes cards months into the future. When they come back, you've forgotten them, and they're not flagged as priorities. Your retention craters quietly while your daily review count looks great. Reserve Easy for cards you genuinely know so deeply you could teach them to someone else.</p>
        </div>
        <div>
          <p className="font-semibold">Hitting "Again" on Everything Out of Perfectionism</p>
          <p>Some students become so focused on perfect recall that they press Again for any hesitation at all. This traps cards in early learning stages indefinitely, floods your daily reviews with the same cards over and over, and prevents you from making progress on new material. If you got it — rate it honestly.</p>
        </div>
        <div>
          <p className="font-semibold">Not Syncing</p>
          <p>Losing 50–100 reviews because you forgot to sync before switching devices is genuinely demoralizing. Make syncing a reflex: open Anki, sync, study, sync. It takes three seconds and saves you from a problem that kills motivation fast.</p>
        </div>
        <div>
          <p className="font-semibold">Using Anki as a Substitute for Active Study</p>
          <p>Anki is a retention engine, not a learning engine. It reinforces what you've been exposed to — it doesn't replace reading, listening, speaking practice, or class engagement. If you're seeing a character for the first time in Anki without ever encountering it in context, you're using it wrong. Use Anki to solidify what you're already meeting in class, in authentic content, and in study group.</p>
        </div>
        <div>
          <p className="font-semibold">Quitting After Falling Behind</p>
          <p>This is the most common and most costly mistake. Falling behind is normal, especially after a break or a hard stretch. The correct response is to adjust your daily limits downward, reset progress on the relevant presentation or lesson, and rebuild from a sustainable baseline. Rage-quitting an Anki deck doesn't delete the vocabulary you still need for your DLPT — it just means you'll have to learn it the hard way under pressure instead.</p>
        </div>
      </div>
    ),
  },
  {
    title: '12. Bonus — Add-ons & Power User Tips (Desktop Only)',
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">What Add-ons Are</p>
          <p>Add-ons are small extensions that modify or enhance Anki's desktop interface. They're only available on the desktop app (not mobile). To install them: go to Tools → Add-ons → Get Add-ons, then paste in the add-on code from AnkiWeb. Restart Anki after installing.</p>
        </div>
        <div>
          <p className="font-semibold">How to Install</p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Open Anki on your computer.</li>
            <li>Go to Tools → Add-ons → Get Add-ons.</li>
            <li>Paste the add-on's numeric code (found on its AnkiWeb page).</li>
            <li>Click OK and restart Anki.</li>
          </ol>
        </div>
        <div>
          <p className="font-semibold">Recommended Add-ons for DLI Mandarin Students</p>
          <ul className="list-none space-y-3 mt-2">
            <li>
              <p className="font-medium">Review Heatmap</p>
              <p>Adds a GitHub-style heatmap to your main screen showing your review activity over time. Incredibly motivating — seeing your streak visualized makes you want to keep it alive. AnkiWeb code: <span className="font-mono bg-slate-100 px-1 rounded">1771074083</span>.</p>
            </li>
            <li>
              <p className="font-medium">More Overview Stats 21</p>
              <p>Adds detailed statistics to your deck overview screen: forecasted reviews, true retention rate, card maturity breakdown. Helps you understand whether your studying is actually working. AnkiWeb code: <span className="font-mono bg-slate-100 px-1 rounded">2091361802</span>.</p>
            </li>
            <li>
              <p className="font-medium">Button Colors Good Again</p>
              <p>Colors the Again button red and the Good button green, making it faster and more intuitive to rate cards correctly without looking at labels. Small change, meaningfully better UX. AnkiWeb code: <span className="font-mono bg-slate-100 px-1 rounded">2494384865</span>.</p>
            </li>
          </ul>
          <p className="mt-3">These three add-ons are lightweight, stable, and genuinely useful. Start here before exploring anything else. The add-on ecosystem is large and some older add-ons break after Anki updates — stick to well-reviewed, recently-updated options.</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500">
          <p>This tutorial is maintained by Hanzi Hub. If something has changed in a recent Anki update or you spot an error, use the "Report a Bug" feature at the top of the page or send an email to <a href="mailto:malaclark1000@gmail.com" className="text-blue-600 hover:underline">malaclark1000@gmail.com</a>.</p>
        </div>
      </div>
    ),
  },
]

function Accordion({ title, content }: { title: string; content: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <span className="font-semibold text-slate-800">{title}</span>
        <span className={`ml-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-white border-t border-slate-100 text-slate-700 text-sm leading-relaxed">
          {content}
        </div>
      )}
    </div>
  )
}

export default function TutorialsPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/auth/login')
        return
      }
      setUserEmail(session.user.email || '')
      setUserId(session.user.id)
      const adminRes = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      })
      const { isAdmin: admin } = await adminRes.json()
      setIsAdmin(admin)
    }
    init()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onBellClick={() => setShowModal(true)} userEmail={userEmail} isAdmin={isAdmin} />
      {showModal && (
        <NotificationModal
          userEmail={userEmail}
          onClose={() => setShowModal(false)}
        />
      )}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Anki Tutorial</h1>
        <p className="text-slate-500 mb-8">A complete guide for DLI Mandarin students. Click any section to expand it.</p>
        <div className="space-y-3">
          {sections.map((section) => (
            <Accordion key={section.title} title={section.title} content={section.content} />
          ))}
        </div>
      </main>
    </div>
  )
}
