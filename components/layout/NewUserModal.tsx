import { useRouter } from "next/navigation"
import { useEffect } from "react"


export function NewUserModal({
    onClick,
    onClose
}: {
    onClick: () => void,
    onClose: () => void
}) {

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
                <h2 className="text-lg font-bold text-slate-800 mb-2">New to Anki?</h2>
                <p className="text-sm text-slate-600 mb-1">
                    Before downloading your first deck, we recommend reading the Anki Tutorial.
                </p>
                <p className="text-sm text-slate-600 mb-6">
                    It covers how to import decks, configure settings, and build a daily review habit — everything you need to get real results from your study time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push('/tutorials')}
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
