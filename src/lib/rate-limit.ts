const submissions = new Map<string, number>()
const WINDOW_MS = 5 * 60 * 1000

export function checkRateLimit(ip: string): { allowed: boolean } {
  const now = Date.now()
  const last = submissions.get(ip)
  if (last !== undefined && now - last < WINDOW_MS) {
    return { allowed: false }
  }
  return { allowed: true }
}

export function recordSubmission(ip: string): void {
  submissions.set(ip, Date.now())
}
