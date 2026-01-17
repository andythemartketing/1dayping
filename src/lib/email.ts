import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL!

export async function sendMagicLinkEmail(to: string, magicLink: string) {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Your Magic Link to Sign In',
    text: `Click this link to sign in: ${magicLink}\n\nThis link will expire in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Sign in to Roude</h2>
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
  }

  try {
    await sgMail.send(msg)
    console.log(`Magic link sent to ${to}`)
  } catch (error) {
    console.error('Error sending magic link:', error)
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
  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    text: content,
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
  }

  try {
    await sgMail.send(msg)
    console.log(`Course email ${emailNumber} sent to ${to}`)
  } catch (error) {
    console.error(`Error sending course email ${emailNumber}:`, error)
    throw new Error('Failed to send course email')
  }
}
