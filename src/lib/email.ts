import { Resend } from 'resend'
import { logMagicLinkInDev } from './email-dev'

const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const IS_DEV = process.env.NODE_ENV === 'development'

export async function sendMagicLinkEmail(to: string, magicLink: string) {
  // In development, just log to console
  if (IS_DEV) {
    logMagicLinkInDev(to, magicLink)
    return
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your Magic Link to Sign In',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to 1dayping</h2>
          <p>Click the button below to sign in to your account:</p>
          <div style="margin: 30px 0;">
            <a href="${magicLink}"
               style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Sign In
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 15 minutes.<br>
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    })
    console.log(`Magic link sent to ${to}`, result)
  } catch (error) {
    console.error('Error sending magic link:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    throw new Error('Failed to send magic link email')
  }
}

export async function sendCourseEmail(
  to: string,
  emailNumber: number,
  subject: string,
  content: string,
  checkoutUrl?: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="color: #666; font-size: 12px; margin-bottom: 20px;">
            Email ${emailNumber}
          </div>
          <div style="line-height: 1.6;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          ${emailNumber === 7 && checkoutUrl ? `
            <div style="margin-top: 30px;">
              <a href="${checkoutUrl}"
                 style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
                Subscribe to Continue
              </a>
            </div>
          ` : ''}
          ${emailNumber > 7 ? `
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              <p>Manage your subscription in your <a href="${process.env.NEXTAUTH_URL}/dashboard">dashboard</a>.</p>
            </div>
          ` : ''}
        </div>
      `,
    })
    console.log(`Course email ${emailNumber} sent to ${to}`)
  } catch (error) {
    console.error(`Error sending course email ${emailNumber}:`, error)
    throw new Error('Failed to send course email')
  }
}
