import { NextRequest, NextResponse } from 'next/server'
import { verifyMagicLink } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=missing_token', request.url))
    }

    // Verify the magic link
    const userId = await verifyMagicLink(token)

    if (!userId) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    // Create session
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error in verify:', error)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}
