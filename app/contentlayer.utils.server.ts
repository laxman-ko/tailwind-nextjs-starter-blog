import {
  allBlogs,
  allAuthors,
  type DocumentTypes,
  type Blog,
  type Authors,
} from '.contentlayer/generated'
import { headers } from 'next/headers'
import tagData from './tag-data.json'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import allProjects from '@/data/projectsData'
import {
  LOCALE_HEADER,
  Locale,
  isValidLocale,
  TranslationText,
  TranslationFn,
  SiteMetadata,
  HeaderNavLink,
  LANGUAGE_COUNTRY_MATCH_REGEX,
  translationHelperFn,
  Project,
} from './contentlayer.helpers'

const getCurrentLocale = async (): Promise<Locale> => {
  const locale = (await headers()).get(LOCALE_HEADER)
  if (!locale || !isValidLocale(locale)) throw new Error('Invalid locale page request:' + locale)
  return locale as Locale
}

const getAllContentByLocale = (content: DocumentTypes[], locale: Locale) => {
  return content.filter((item) => item.locale === locale) as DocumentTypes[]
}

const getAllBlogs = async (): Promise<Blog[]> => {
  const locale = await getCurrentLocale()
  return getAllContentByLocale(allBlogs as Blog[], locale) as Blog[]
}

const getAllAuthors = async (): Promise<Authors[]> => {
  const locale = await getCurrentLocale()
  return getAllContentByLocale(allAuthors as Authors[], locale) as Authors[]
}

const getAllTags = async (): Promise<Record<string, number>> => {
  const locale = await getCurrentLocale()
  return tagData[locale]
}

const getAllProjects = async (): Promise<Project[]> => {
  const locale = await getCurrentLocale()
  return allProjects[locale]
}

const getTranslation = async (): Promise<TranslationFn> => {
  const locale = await getCurrentLocale()
  return (text: TranslationText, ...args: (string | number)[]) => {
    return translationHelperFn(locale, text, ...args)
  }
}

const getSiteMetadata = async (): Promise<SiteMetadata> => {
  const locale = await getCurrentLocale()
  return siteMetadata[locale]
}

const getSEOLocale = async (): Promise<string> => {
  const locale = await getCurrentLocale()
  return locale.replace('-', '_')
}

const getHeaderNavLinks = async (): Promise<HeaderNavLink[]> => {
  const locale = await getCurrentLocale()
  return headerNavLinks[locale]
}

export type { Blog, Authors } from '.contentlayer/generated'

export {
  getAllBlogs,
  getAllAuthors,
  getAllTags,
  getTranslation,
  getCurrentLocale,
  getSiteMetadata,
  getSEOLocale,
  getHeaderNavLinks,
  getAllProjects,
}

export { LANGUAGE_COUNTRY_MATCH_REGEX, LOCALE_HEADER }

export type { Locale, TranslationFn, TranslationText }
