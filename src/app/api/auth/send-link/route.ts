import { NextRequest, NextResponse } from 'next/server'
import { generateMagicLink } from '@/lib/auth'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Generate magic link
    const magicLink = await generateMagicLink(email.toLowerCase().trim())

    // Send email
    await sendMagicLinkEmail(email, magicLink)

    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email',
    })
  } catch (error) {
    console.error('Error in send-link:', error)
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    )
  }
}
