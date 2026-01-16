import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ['/', '/login']
  const isPublicRoute = publicRoutes.includes(pathname)

  // If accessing protected route without session, redirect to login
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing login with session, redirect to dashboard
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
