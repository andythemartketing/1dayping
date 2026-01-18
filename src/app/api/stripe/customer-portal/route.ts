import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const user = await requireSession()

    if (!user.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/settings`,
    })

    // Redirect to Stripe customer portal
    return NextResponse.redirect(session.url)
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    return NextResponse.json(
      { error: 'Failed to access customer portal' },
      { status: 500 }
    )
  }
}
