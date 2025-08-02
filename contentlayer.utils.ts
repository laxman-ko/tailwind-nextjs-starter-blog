import { DocumentTypes } from '.contentlayer/generated'
import { allBlogs, allAuthors } from '.contentlayer/generated'
import type { Blog, Authors } from '.contentlayer/generated'
import translationsText from '@/data/translations.json'

import siteMetadata from '@/data/siteMetadata'

export const LOCALES = siteMetadata.locales
export const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/
export const LOCALE_HEADER = 'x-locale'

export type Locale = keyof typeof LOCALES
export type LocaleName = (typeof LOCALES)[Locale]

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

export type NextPageProps = {
  params?: Promise<{ slug?: string[]; page?: string; tag?: string }>
  searchParams: Promise<{ locale: Locale }>
}

const isNextPageProps = (propsOrLocale: NextPageProps | Locale): propsOrLocale is NextPageProps => {
  return 'searchParams' in (propsOrLocale as NextPageProps)
}

export const getAllContentByLocale = (content: DocumentTypes[], locale: Locale) => {
  return content.filter((item) => item.locale === locale) as DocumentTypes[]
}

export const getAllBlogsByLocale = async (props: NextPageProps): Promise<Blog[]> => {
  const locale = (await props.searchParams).locale
  return getAllContentByLocale(allBlogs as Blog[], locale) as Blog[]
}

export const getAllAuthorsByLocale = async (props: NextPageProps): Promise<Authors[]> => {
  const locale = (await props.searchParams).locale
  return getAllContentByLocale(allAuthors as Authors[], locale) as Authors[]
}

type TranslateFn = (text: keyof typeof translationsText, ...args: (string | number)[]) => string

export const translate = (locale: Locale) => {
  const translateFn: TranslateFn = (text, ...args) => {
    const template = translationsText[text][locale] || text

    let i = 0
    return template.replace(/%%/g, () => {
      return args[i++]?.toString() || ''
    })
  }

  return translateFn
}

export const translatePage = async (props: NextPageProps): Promise<TranslateFn> =>
  props.searchParams.then((searchParams) => {
    const locale = searchParams.locale
    return translate(locale)
  })

export { allBlogs, allAuthors } from '.contentlayer/generated'
export type { Blog, Authors } from '.contentlayer/generated'
