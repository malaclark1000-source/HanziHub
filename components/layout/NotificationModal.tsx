import { useState } from 'react'
import { supabase } from '@/app/utils/supabase'

export function NotificationModal({
    userEmail,
    onClose,
}: {
    userEmail: string
    onClose: () => void
}) {
    const [email, setEmail] = useState(userEmail)
    const [notifyUpdates, setNotifyUpdates] = useState(true)
    const [notifyNew, setNotifyNew] = useState(true)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    async function handleSave() {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            await supabase.from('notification_prefs').upsert({
                user_id: user.id,
                email: email,
                notify_updates: notifyUpdates,
                notify_new_decks: notifyNew,
                has_responded: true,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' })
            setSaved(true)
            setTimeout(onClose, 1200)
        } finally {
            setLoading(false)
        }
    }

    async function handleDecline() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { onClose(); return }
        await supabase.from('notification_prefs').upsert({
            user_id: user.id,
            email: userEmail,
            notify_updates: false,
            notify_new_decks: false,
            has_responded: true,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Stay in the loop</h2>
                <p className="text-sm text-slate-600 mb-5">
                    Get notified when decks are updated or new decks are added.
                </p>

                {saved ? (
                    <div className="text-center py-4 text-green-600 font-medium">Preferences saved!</div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email for notifications</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifyUpdates}
                                    onChange={e => setNotifyUpdates(e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600"
                                />
                                <span className="text-sm text-slate-700">Notify me when a deck I downloaded gets updated</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifyNew}
                                    onChange={e => setNotifyNew(e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600"
                                />
                                <span className="text-sm text-slate-700">Notify me when a new deck is added</span>
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                            >
                                {loading ? 'Saving...' : 'Save Preferences'}
                            </button>
                            <button
                                onClick={handleDecline}
                                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                            >
                                No thanks
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
