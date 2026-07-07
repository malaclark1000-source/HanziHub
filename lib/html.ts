// Escapes text before it's interpolated into an HTML email body, so a
// message like "<img src=x onerror=...>" renders as literal text instead
// of executing in the recipient's mail client.
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Strips characters that could be used for email header injection
// (e.g. "Subject: hi\nBcc: attacker@evil.com") from single-line header values.
export function sanitizeHeaderValue(input: string): string {
  return input.replace(/[\r\n]+/g, ' ').trim()
}
