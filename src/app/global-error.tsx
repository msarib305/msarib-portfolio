'use client'

import { useEffect } from 'react'
import './globals.css'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main id="main-content" className="error-page">
          <div className="error-page-inner">
            <span className="error-page-code" aria-hidden="true">500</span>
            <h1 className="error-page-heading">Critical error</h1>
            <p className="error-page-body">
              The application crashed. Reload the page. If it keeps happening, try again later.
            </p>
            <button
              onClick={reset}
              className="pill-btn pill-btn--primary pill-btn--lg"
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
