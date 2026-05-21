'use client'

import { useState, useEffect } from 'react'

function formatLahoreTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Karachi',
    hour:     '2-digit',
    minute:   '2-digit',
    second:   '2-digit',
    hour12:   false,
  }).format(new Date())
}

export function LahoreClock() {
  const [time, setTime] = useState('--:--:--')

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNext = () => {
      // Align to the next exact second to avoid drift. setInterval
      // drifts over hours because it is best-effort; aligning to
      // wall-clock seconds keeps the display in step with reality.
      const msToNext = 1000 - (Date.now() % 1000) + 5
      timeoutId = setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          setTime(formatLahoreTime())
        }
        scheduleNext()
      }, msToNext)
    }

    // Catch up immediately when the tab regains focus so the clock
    // does not look stale after returning from background.
    const onVisibility = () => {
      if (document.visibilityState !== 'hidden') setTime(formatLahoreTime())
    }

    // Initial paint of the current time. Deferred via setTimeout(0)
    // so the setState happens in a queued callback rather than inside
    // the effect body (React 19 set-state-in-effect rule).
    const initId = setTimeout(() => setTime(formatLahoreTime()), 0)
    scheduleNext()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(initId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="footer-clock" aria-label={`Current Lahore time: ${time} PKT`}>
      <span className="clock-dot" aria-hidden="true" />
      <span>
        LAHORE{' '}·{' '}
        <strong>{time}</strong>
        {' '}PKT
      </span>
    </div>
  )
}
