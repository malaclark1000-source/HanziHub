import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { type DeckType } from "@/types/types"
import { deckTypeInfo } from "@/lib/constants"

const TUTORIAL_BLURBS: Record<DeckType, string> = {
    anki: 'It covers how to import decks, configure settings, and build a daily review habit — everything you need to get real results from your study time.',
    pleco: 'It walks through importing the deck step by step, including the import settings that keep your flashcards matching the curriculum definitions.',
}


export function NewUserModal({
    deckType,
    onClick,
    onReadTutorial,
    onClose
}: {
    deckType: DeckType,
    onClick: () => void,
    onReadTutorial: () => void,
    onClose: () => void
}) {

    const router = useRouter()
    const dialogRef = useRef<HTMLDivElement>(null)
    const { label: appName, tutorialPath } = deckTypeInfo(deckType)


    // Move focus into the dialog, keep Tab inside it, close on Escape, and
    // hand focus back to whatever was focused before (the Download button)
    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null
        const buttons = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button') ?? [])
        buttons()[0]?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            } else if (event.key === 'Tab') {
                const focusable = buttons()
                const first = focusable[0]
                const last = focusable[focusable.length - 1]
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault()
                    last?.focus()
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault()
                    first?.focus()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            previouslyFocused?.focus()
        }
    }, [onClose])

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="new-user-modal-title"
                aria-describedby="new-user-modal-description"
                className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6"
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    ✕
                </button>
                <h2 id="new-user-modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 pr-8">New to {appName}?</h2>
                <div id="new-user-modal-description">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                        Before downloading your first deck, we recommend reading the {appName} Tutorial.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                        {TUTORIAL_BLURBS[deckType]}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => { onReadTutorial(); router.push(tutorialPath) }}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Read the Tutorial
                    </button>
                    <button
                        onClick={onClick}
                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                    >
                        Download Anyway
                    </button>
                </div>
            </div>
        </div>
    )
}
