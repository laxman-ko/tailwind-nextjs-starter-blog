import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import siteMetadata from '@/data/siteMetadata'
import { getLocaleByPathname, LANGUAGE_COUNTRY_MATCH_REGEX } from 'contentlayer/generated'

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const { pathname } = nextUrl

  const locale = getLocaleByPathname(pathname)

  if (!locale) {
    nextUrl.searchParams.set('locale', siteMetadata.locale)
    return NextResponse.rewrite(nextUrl)
  }

  // if locale is not valid, return 400
  if (locale === 400) return NextResponse.json({ error: 'Bad Request' }, { status: 400 })

  // remove locale from pathname
  nextUrl.pathname = pathname.replace(LANGUAGE_COUNTRY_MATCH_REGEX, '')

  nextUrl.searchParams.set('locale', locale)

  const response = NextResponse.rewrite(nextUrl)

  response.headers.set('x-locale', locale)

  return response
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'], // apply middleware to all routes
}
