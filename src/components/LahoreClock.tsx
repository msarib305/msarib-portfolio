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
    const id = setInterval(() => setTime(formatLahoreTime()), 1000)
    return () => clearInterval(id)
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
