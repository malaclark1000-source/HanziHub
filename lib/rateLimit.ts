// Best-effort in-memory rate limiter. This resets whenever the serverless
// function cold-starts and is per-instance (not shared across instances),
// so it won't perfectly stop a determined attacker — but it raises the bar
// against casual abuse/spam with zero extra infrastructure. For stronger
// guarantees, swap this for a shared store like Upstash Redis.
const buckets = new Map<string, { count: number; resetAt: number }>()

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  bucket.count += 1
  return bucket.count > limit
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
