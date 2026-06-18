'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { sendContactMessage } from '@/app/contact/actions'
import type { ContactFormState } from '@/lib/contact-schema'
import { TurnstileWidget } from '@/components/TurnstileWidget'
import { ContactSuccess } from '@/components/ContactSuccess'
import { PillButton } from '@/components/PillButton'

const initialState: ContactFormState = { status: 'idle' }

interface ContactFormProps {
  turnstileSiteKey: string
}

export function ContactForm({ turnstileSiteKey }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(sendContactMessage, initialState)
  const turnstileRef = useRef<TurnstileInstance | null>(null)
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const [timeoutWarning, setTimeoutWarning] = useState(false)

  useEffect(() => {
    if (!state.errors?.turnstile_token) return
    turnstileRef.current?.reset()
    // Deferred to avoid synchronous setState in effect body.
    // onExpire callback also fires when reset() is called, but this ensures
    // the ready flag clears even if onExpire is delayed.
    const id = setTimeout(() => setTurnstileReady(false), 0)
    return () => clearTimeout(id)
  }, [state.errors?.turnstile_token])

  // Show a fallback email CTA if the server action takes longer than 30 seconds.
  useEffect(() => {
    if (!isPending) {
      const id = setTimeout(() => setTimeoutWarning(false), 0)
      return () => clearTimeout(id)
    }
    const timer = setTimeout(() => setTimeoutWarning(true), 30_000)
    return () => clearTimeout(timer)
  }, [isPending])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setClientError(null)

    if (!navigator.onLine) {
      e.preventDefault()
      setClientError('You appear to be offline. Check your connection and try again.')
      return
    }

    if (!turnstileReady) {
      e.preventDefault()
      setClientError('Security check not ready yet. Wait a moment and try again.')
      return
    }
  }

  if (state.status === 'success' && state.submittedName) {
    return <ContactSuccess name={state.submittedName} />
  }

  const formError = clientError ?? state.errors?._form?.[0] ?? null

  return (
    <form action={formAction} onSubmit={handleSubmit} className="contact-form" noValidate>
      <h2 className="contact-form-heading">Send a message</h2>

      {formError && (
        <div className="form-error-banner" role="alert">
          <p>{formError}</p>
        </div>
      )}

      {timeoutWarning && (
        <div className="form-warning-banner" role="status">
          <p>
            This is taking longer than expected. If it keeps failing, email me directly at{' '}
            <a href="mailto:contact@msarib.dev" translate="no">contact@msarib.dev</a>.
          </p>
        </div>
      )}

      <div className="field">
        <label htmlFor="contact-name" className="field-label">
          Your name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder="Full name"
          aria-describedby={state.errors?.name ? 'error-name' : undefined}
          className={state.errors?.name ? 'field-input is-error' : 'field-input'}
        />
        {state.errors?.name && (
          <p id="error-name" className="field-error" role="alert">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="contact-email" className="field-label">
          Your email <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@studio.com"
          aria-describedby={state.errors?.email ? 'error-email' : undefined}
          className={state.errors?.email ? 'field-input is-error' : 'field-input'}
        />
        {state.errors?.email && (
          <p id="error-email" className="field-error" role="alert">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="contact-company" className="field-label">
          Company <span className="field-optional">(optional)</span>
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={100}
          placeholder="Studio or company name"
          aria-describedby={state.errors?.company ? 'error-company' : undefined}
          className={state.errors?.company ? 'field-input is-error' : 'field-input'}
          data-1p-ignore=""
          data-lpignore="true"
          data-form-type="other"
        />
        {state.errors?.company && (
          <p id="error-company" className="field-error" role="alert">
            {state.errors.company[0]}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="contact-message" className="field-label">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="What are you working on?"
          aria-describedby={state.errors?.message ? 'error-message' : undefined}
          className={state.errors?.message ? 'field-input field-textarea is-error' : 'field-input field-textarea'}
          autoComplete="off"
          data-1p-ignore=""
          data-lpignore="true"
          data-form-type="other"
          suppressHydrationWarning
        />
        {state.errors?.message && (
          <p id="error-message" className="field-error" role="alert">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      <TurnstileWidget
        ref={turnstileRef}
        siteKey={turnstileSiteKey}
        onSuccess={() => setTurnstileReady(true)}
        onError={() => setTurnstileReady(false)}
        onExpire={() => setTurnstileReady(false)}
      />
      {state.errors?.turnstile_token && (
        <p className="field-error" role="alert">
          {state.errors.turnstile_token[0]}
        </p>
      )}

      <PillButton
        variant="primary"
        size="lg"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Sending...' : 'Send message'}
      </PillButton>
    </form>
  )
}
