import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocaleByPathname, LANGUAGE_COUNTRY_MATCH_REGEX } from './i18n/i18n.utils'

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const { pathname } = nextUrl

  const locale = getLocaleByPathname(pathname)

  if (!locale) return NextResponse.next()

  // if locale is not valid, return 400
  if (locale === 400) return NextResponse.json({ error: 'Bad Request' }, { status: 400 })

  // remove locale from pathname
  nextUrl.pathname = pathname.replace(LANGUAGE_COUNTRY_MATCH_REGEX, '')

  const response = NextResponse.rewrite(nextUrl)

  response.headers.set('x-locale', locale)
  return response
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'], // apply middleware to all routes
}
