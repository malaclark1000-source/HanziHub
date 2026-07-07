// Pass the current session's access_token (session.access_token), not an email —
// the server verifies the token itself and looks up the identity from it.
export async function checkAdminStatus(accessToken: string | undefined) {
  if (!accessToken) {
    return false
  }
  const res = await fetch('/api/check-admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return (await res.json()).isAdmin
}
