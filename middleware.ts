import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import siteMetadata from '@/data/siteMetadata'
import {
  getLocaleByPathname,
  LANGUAGE_COUNTRY_MATCH_REGEX,
  LOCALE_HEADER,
} from 'contentlayer/generated'

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const { pathname } = nextUrl

  const locale = getLocaleByPathname(pathname)

  // if locale is not valid, return 400
  if (locale === 400) return NextResponse.json({ error: 'Bad Request' }, { status: 400 })

  if (locale) {
    nextUrl.pathname = pathname.replace(LANGUAGE_COUNTRY_MATCH_REGEX, '')
  }

  nextUrl.searchParams.set('locale', locale || siteMetadata.locale)

  const response = NextResponse.rewrite(nextUrl)

  response.headers.set(LOCALE_HEADER, locale || siteMetadata.locale)

  return response
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'], // apply middleware to all routes
}
