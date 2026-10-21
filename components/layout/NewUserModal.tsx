import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { type DeckType } from "@/types/types"
import { deckTypeInfo } from "@/lib/constants"

const TUTORIAL_ROUTES: Record<DeckType, string> = {
    anki: '/tutorials',
    pleco: '/tutorials/pleco',
}

const TUTORIAL_BLURBS: Record<DeckType, string> = {
    anki: 'It covers how to import decks, configure settings, and build a daily review habit — everything you need to get real results from your study time.',
    pleco: 'It walks through importing the deck step by step, including the import settings that keep your flashcards matching the curriculum definitions.',
}


export function NewUserModal({
    deckType,
    onClick,
    onClose
}: {
    deckType: DeckType,
    onClick: () => void,
    onClose: () => void
}) {

    const appName = deckTypeInfo(deckType).label

    const router = useRouter()


    // Escape key handler: exit out of the modal
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleEsc)
        return () => {
            window.removeEventListener('keydown', handleEsc)
        }
    }, [onClose]) // Re-run if onClose changes

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-2">New to {appName}?</h2>
                <p className="text-sm text-slate-600 mb-1">
                    Before downloading your first deck, we recommend reading the {appName} Tutorial.
                </p>
                <p className="text-sm text-slate-600 mb-6">
                    {TUTORIAL_BLURBS[deckType]}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push(TUTORIAL_ROUTES[deckType])}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Read the Tutorial
                    </button>
                    <button
                        onClick={onClick}
                        className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                    >
                        Download Anyway
                    </button>
                </div>
            </div>
        </div>
    )
}
