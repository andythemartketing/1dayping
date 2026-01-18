import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMagicLinkEmail } from '@/lib/email'
import { generateMagicLink } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, goal } = await request.json()

    if (!email || !goal) {
      return NextResponse.json(
        { error: 'Email and goal are required' },
        { status: 400 }
      )
    }

    // Generate magic link for the user
    const magicLink = await generateMagicLink(email)

    // Send magic link email
    await sendMagicLinkEmail(email, magicLink)

    // Store the goal temporarily (you might want to create a temp table or session)
    // For now, we'll rely on the onboarding flow after they click the magic link

    return NextResponse.json({
      success: true,
      message: 'Check your email to continue',
    })
  } catch (error) {
    console.error('Quick start error:', error)
    return NextResponse.json(
      { error: 'Failed to start. Please try again.' },
      { status: 500 }
    )
  }
}
