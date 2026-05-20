import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name must be 100 characters or fewer.' }),
  email: z
    .string()
    .email({ message: 'Enter a valid email address.' })
    .max(254, { message: 'Email must be 254 characters or fewer.' }),
  company: z
    .string()
    .max(100, { message: 'Company must be 100 characters or fewer.' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(5000, { message: 'Message must be 5000 characters or fewer.' }),
  turnstile_token: z
    .string()
    .min(1, { message: 'Verification required. Please complete the challenge.' }),
})

export type ContactFormInput = z.infer<typeof ContactFormSchema>

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  errors?: {
    name?: string[]
    email?: string[]
    company?: string[]
    message?: string[]
    turnstile_token?: string[]
    _form?: string[]
  }
  submittedName?: string
}
