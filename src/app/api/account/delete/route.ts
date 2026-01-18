import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { cookies } from 'next/headers'

export async function DELETE() {
  try {
    const user = await requireSession()

    // Cancel Stripe subscription if exists
    if (user.subscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.subscriptionId)
      } catch (error) {
        console.error('Error cancelling Stripe subscription:', error)
        // Continue with deletion even if Stripe cancellation fails
      }
    }

    // Delete user's data (Prisma will cascade delete related records)
    await prisma.user.delete({
      where: { id: user.id },
    })

    // Clear session cookie
    const cookieStore = await cookies()
    cookieStore.delete('session')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
