import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSession()
    const { id } = await params

    // Verify goal belongs to user
    const goal = await prisma.goal.findUnique({
      where: { id, userId: user.id },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (goal.completedAt || goal.cancelledAt) {
      return NextResponse.json({ error: 'Goal already completed or cancelled' }, { status: 400 })
    }

    // Mark goal as completed
    await prisma.goal.update({
      where: { id },
      data: {
        completedAt: new Date(),
        isActive: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing goal:', error)
    return NextResponse.json({ error: 'Failed to complete goal' }, { status: 500 })
  }
}
