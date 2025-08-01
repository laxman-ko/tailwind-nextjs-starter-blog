import { Locale } from '@/data/types'
import siteMetadata from '@/data/siteMetadata'

export const LOCALES = siteMetadata.locales

export const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/

export type LOCALE = keyof typeof LOCALES
export type LOCALE_NAME = (typeof LOCALES)[LOCALE]

export const getLocaleByPathname = (pathname: string): Locale | null => {
  // match /us/en/ (country/language) or /en/ (language)
  const [_, countryOrLanguageCode, languageCode] =
    pathname.match(LANGUAGE_COUNTRY_MATCH_REGEX) ?? []

  if (!countryOrLanguageCode) return null

  if (!languageCode) return `${countryOrLanguageCode}` as Locale

  return `${languageCode}-${countryOrLanguageCode.toUpperCase()}` as Locale
}

export const getLocale = (req: Request): Locale | null => {
  const { headers } = req
  const locale = headers.get('x-locale') || null
  return locale as Locale
}
