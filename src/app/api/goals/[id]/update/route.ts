import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const VALID_CATEGORIES = [
  'Health',
  'Relationships',
  'Career',
  'Money',
  'Business',
  'Learning',
  'Productivity',
  'Creativity',
]

const VALID_STAGES = ['Just started', 'Intermediate', 'Advanced']

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSession()
    const { id } = await params
    const body = await request.json()

    const { category, goalText, stage } = body

    // Validation
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    if (!goalText || goalText.trim().length === 0 || goalText.length > 200) {
      return NextResponse.json(
        { error: 'Goal text must be between 1 and 200 characters' },
        { status: 400 }
      )
    }

    if (!stage || !VALID_STAGES.includes(stage)) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
    }

    // Verify goal belongs to user
    const goal = await prisma.goal.findUnique({
      where: { id, userId: user.id },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Don't allow editing completed or cancelled goals
    if (goal.completedAt || goal.cancelledAt) {
      return NextResponse.json(
        { error: 'Cannot edit completed or cancelled goals' },
        { status: 400 }
      )
    }

    // Update goal
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        category,
        goalText: goalText.trim(),
        stage,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, goal: updatedGoal })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}
