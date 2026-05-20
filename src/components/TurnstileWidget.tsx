'use client'

import { forwardRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
  siteKey: string
}

export const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey }, ref) {
    return (
      <div className="turnstile-wrap">
        <Turnstile
          ref={ref}
          siteKey={siteKey}
          options={{
            theme:          'dark',
            refreshExpired: 'auto',
          }}
        />
      </div>
    )
  },
)
