'use server'

import { headers } from 'next/headers'
import { ContactFormSchema, type ContactFormState } from '@/lib/contact-schema'
import { sendContactEmail } from '@/lib/email'
import { checkRateLimit, recordSubmission } from '@/lib/rate-limit'

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name:            String(formData.get('name') ?? ''),
    email:           String(formData.get('email') ?? ''),
    company:         String(formData.get('company') ?? ''),
    message:         String(formData.get('message') ?? ''),
    turnstile_token: String(formData.get('cf-turnstile-response') ?? ''),
  }

  const parsed = ContactFormSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, company, message, turnstile_token } = parsed.data

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return {
      status: 'error',
      errors: { _form: ['Too many submissions. Please wait a few minutes and try again.'] },
    }
  }

  try {
    const turnstileRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret:   process.env.TURNSTILE_SECRET_KEY,
          response: turnstile_token,
          remoteip: ip,
        }),
      },
    )
    const turnstileData = (await turnstileRes.json()) as { success: boolean }
    if (!turnstileData.success) {
      return {
        status: 'error',
        errors: { turnstile_token: ['Verification failed. Reload and try again.'] },
      }
    }
  } catch {
    return {
      status: 'error',
      errors: { _form: ['Verification service unavailable. Try again in a moment.'] },
    }
  }

  try {
    await sendContactEmail({
      name,
      email,
      company: company || null,
      message,
    })
  } catch (err) {
    console.error('[contact] Resend error:', err)
    return {
      status: 'error',
      errors: { _form: ['Something went wrong. Try again or email contact@msarib.dev directly.'] },
    }
  }

  recordSubmission(ip)
  return { status: 'success', submittedName: name }
}
