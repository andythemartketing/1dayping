import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { cancelSubscription } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 400 }
      )
    }

    // Cancel subscription in Stripe
    await cancelSubscription(user.subscriptionId)

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isCancelled: true,
        hasSubscribed: false,
        nextEmailAt: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
