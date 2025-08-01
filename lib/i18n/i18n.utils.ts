import { Locale } from '@/data/types'
import siteMetadata from '@/data/siteMetadata'
import { headers } from 'next/headers'

export const LOCALES = siteMetadata.locales

export const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/

export type LOCALE = keyof typeof LOCALES
export type LOCALE_NAME = (typeof LOCALES)[LOCALE]

export const isValidLocale = (locale: string): boolean => {
  return Object.keys(LOCALES).includes(locale)
}

export const getLocaleByPathname = (pathname: string): Locale | 400 | null => {
  // match /us/en/ (country/language) or /en/ (language)
  const [_, countryOrLanguageCode, languageCode] =
    pathname.match(LANGUAGE_COUNTRY_MATCH_REGEX) ?? []

  if (!countryOrLanguageCode) return null

  const locale = (
    languageCode ? `${languageCode}-${countryOrLanguageCode.toUpperCase()}` : countryOrLanguageCode
  ) as Locale

  if (!isValidLocale(locale)) return 400

  return locale
}

export const getSiteLocale = async (): Promise<Locale | null> => {
  const locale = (await headers()).get('x-locale') || siteMetadata.locale
  return locale as Locale
}

export const getSiteLanguage = async (): Promise<string> => {
  const locale = await getSiteLocale()
  return locale?.split('-')[0] || siteMetadata.language
}
