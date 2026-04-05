export async function checkAdminStatus(email: string | undefined) {
  if (email === undefined) {
    return false
  }
  const res = await fetch('/api/check-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  })
  return (await res.json()).isAdmin
}
