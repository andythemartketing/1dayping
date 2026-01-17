import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCourseEmail } from '@/lib/email'
import { getEmailContent } from '@/lib/email-content'
import { createCheckoutSession } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // Verify cron secret if set (for production security)
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    // Find users who need their next email
    const users = await prisma.user.findMany({
      where: {
        nextEmailAt: {
          lte: now,
        },
        isCancelled: false,
        OR: [
          { emailsSent: { lt: 7 } }, // Free trial users (0-6 emails sent)
          { hasSubscribed: true }, // Paid subscribers
        ],
      },
    })

    const results = []

    for (const user of users) {
      try {
        const nextEmailNumber = user.emailsSent + 1

        // Get email content
        const { subject, content } = getEmailContent(nextEmailNumber)

        // Create checkout URL for email 7
        let checkoutUrl: string | undefined
        if (nextEmailNumber === 7) {
          try {
            checkoutUrl = await createCheckoutSession(user.email, user.id)
          } catch (error) {
            console.error('Failed to create checkout URL for email 7:', error)
          }
        }

        // Send email
        await sendCourseEmail(user.email, nextEmailNumber, subject, content, checkoutUrl)

        // Update user
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailsSent: nextEmailNumber,
            lastEmailSentAt: now,
            // Schedule next email for tomorrow (only if not email 7 without subscription)
            nextEmailAt:
              nextEmailNumber === 7 && !user.hasSubscribed
                ? null // Stop sending after email 7 if not subscribed
                : new Date(now.getTime() + 24 * 60 * 60 * 1000),
          },
        })

        // Log the email
        await prisma.emailLog.create({
          data: {
            userId: user.id,
            emailNumber: nextEmailNumber,
            subject,
            status: 'sent',
          },
        })

        results.push({
          email: user.email,
          emailNumber: nextEmailNumber,
          status: 'sent',
        })
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error)
        results.push({
          email: user.email,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent: results.filter((r) => r.status === 'sent').length,
      emailsFailed: results.filter((r) => r.status === 'failed').length,
      results,
    })
  } catch (error) {
    console.error('Error in send-emails cron:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    )
  }
}
