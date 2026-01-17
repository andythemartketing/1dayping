import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          console.error('No userId in checkout session metadata')
          break
        }

        // Get subscription details
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string

        // Update user with subscription info
        await prisma.user.update({
          where: { id: userId },
          data: {
            hasSubscribed: true,
            subscriptionId,
            stripeCustomerId: customerId,
            // Resume emails - schedule next one for tomorrow
            nextEmailAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        })

        console.log(`Subscription activated for user ${userId}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('No userId in subscription metadata')
          break
        }

        // Check if subscription was cancelled
        const isCancelled = subscription.status === 'canceled'

        await prisma.user.update({
          where: { id: userId },
          data: {
            isCancelled,
            hasSubscribed: !isCancelled,
            // Stop scheduling emails if cancelled
            nextEmailAt: isCancelled ? null : undefined,
          },
        })

        console.log(`Subscription updated for user ${userId}: ${subscription.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('No userId in subscription metadata')
          break
        }

        // Mark as cancelled
        await prisma.user.update({
          where: { id: userId },
          data: {
            isCancelled: true,
            hasSubscribed: false,
            nextEmailAt: null,
          },
        })

        console.log(`Subscription deleted for user ${userId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
