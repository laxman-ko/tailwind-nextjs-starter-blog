import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Match locale from path, e.g., /ne-NP/about → locale = 'ne-NP'
  const localeMatch = pathname.match(/^\/(en|ne|ne-NP|en-US)(\/|$)/)
  const locale = localeMatch?.[1] ?? 'en'

  const response = NextResponse.next()
  response.cookies.set('locale', locale) // optionally set a cookie

  request.headers.set('x-locale', locale) // custom header to pass to server components
  return response
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'], // apply middleware to all routes
}
