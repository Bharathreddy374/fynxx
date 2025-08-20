// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function is the middleware
export function middleware(request: NextRequest) {
  // 1. Get the access token from the user's cookies
  const accessToken = request.cookies.get('access_token')?.value

  // 2. If there's no access token and the user is trying to access a protected page...
  if (!accessToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    // 3. ...redirect them to the login page.
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 4. If the user is logged in, or is on a public page, let them proceed.
  return NextResponse.next()
}

// This configures which routes the middleware will run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}