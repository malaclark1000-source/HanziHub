import { supabase } from "@/app/utils/supabase"

export async function checkNotificationPrefs(userId: string) {
  // TODO: realistically we should be checking for bad responses.
  const { data } = await supabase
    .from('notification_prefs')
    .select('has_responded')
    .eq('user_id', userId)
    .single()
  return data?.has_responded
}
