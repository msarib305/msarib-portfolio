import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ContactEmailPayload {
  name:    string
  email:   string
  company: string | null
  message: string
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const { name, email, company, message } = payload

  const companyRow = company
    ? `<tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 13px;">Company</td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 15px;">${escapeHtml(company)}</td>
      </tr>`
    : ''

  const { error } = await resend.emails.send({
    from:    `Contact Form <${process.env.RESEND_FROM_EMAIL}>`,
    to:      [process.env.RESEND_TO_EMAIL as string],
    replyTo: email,
    subject: `[msarib.dev] ${escapeHtml(name)}${company ? ` · ${escapeHtml(company)}` : ''}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="font-family: system-ui, sans-serif; background: #101014; color: #ffffff; padding: 40px 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #18181c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
    <p style="font-size: 12px; font-family: monospace; letter-spacing: 0.08em; text-transform: uppercase; color: #00d9c4; margin: 0 0 24px;">msarib.dev contact form</p>
    <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 24px; color: #ffffff;">New message from ${escapeHtml(name)}</h1>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); width: 120px; color: rgba(255,255,255,0.6); font-size: 13px;">Name</td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 15px;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 13px;">Email</td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 15px;"><a href="mailto:${email}" style="color: #00d9c4;">${email}</a></td>
      </tr>
      ${companyRow}
    </table>
    <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 24px;">
      <p style="font-size: 12px; font-family: monospace; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin: 0 0 12px;">Message</p>
      <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.9); margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
    <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 24px 0 0;">Reply directly to this email to respond to ${escapeHtml(name)} at ${email}.</p>
  </div>
</body>
</html>`,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
