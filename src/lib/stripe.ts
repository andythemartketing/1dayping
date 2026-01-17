import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export async function createCheckoutSession(
  userEmail: string,
  userId: string
): Promise<string> {
  const priceId = process.env.STRIPE_PRICE_ID

  if (!priceId) {
    throw new Error('STRIPE_PRICE_ID is not set')
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  if (!session.url) {
    throw new Error('Failed to create checkout session URL')
  }

  return session.url
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.cancel(subscriptionId)
}
