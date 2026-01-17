import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if already subscribed
    if (user.hasSubscribed) {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 400 }
      )
    }

    // Check if user has received at least 7 emails
    if (user.emailsSent < 7) {
      return NextResponse.json(
        { error: 'Complete free trial first' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const checkoutUrl = await createCheckoutSession(user.email, user.id)

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
