'use client'

import { useEffect } from 'react'
import { PillButton } from '@/components/PillButton'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[segment-error]', error)
  }, [error])

  return (
    <main id="main-content" className="error-page">
      <div className="error-page-inner">
        <span className="error-page-code" aria-hidden="true">500</span>
        <h1 className="error-page-heading">Something went wrong</h1>
        <p className="error-page-body">
          An unexpected error occurred. Try again, or return to the home page if the problem persists.
        </p>
        <div className="error-page-actions">
          <PillButton variant="primary" size="lg" onClick={reset}>
            Try again
          </PillButton>
          <PillButton href="/" variant="secondary" size="lg">
            Back to home
          </PillButton>
        </div>
      </div>
    </main>
  )
}
