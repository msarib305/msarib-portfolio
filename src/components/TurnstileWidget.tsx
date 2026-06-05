'use client'

import { forwardRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
  siteKey: string
  onSuccess?: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, onSuccess, onError, onExpire }, ref) {
    return (
      <div className="turnstile-wrap">
        <Turnstile
          ref={ref}
          siteKey={siteKey}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
          options={{
            theme:          'dark',
            refreshExpired: 'auto',
          }}
        />
      </div>
    )
  },
)
