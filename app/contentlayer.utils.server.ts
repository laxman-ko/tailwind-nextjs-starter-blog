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
  PageProps,
} from './contentlayer.helpers'

const getCurrentLocale = async (props?: PageProps): Promise<Locale> => {
  const localeFromProps = (await props?.searchParams)?.locale
  const localeFromHeader = (await headers()).get(LOCALE_HEADER)
  const locale = localeFromProps || localeFromHeader
  if (!locale || !isValidLocale(locale)) throw new Error('Invalid locale page request:' + locale)
  return locale as Locale
}

const getAllContentByLocale = (content: DocumentTypes[], locale: Locale) => {
  return content.filter((item) => item.locale === locale) as DocumentTypes[]
}

const getAllBlogs = async (props?: PageProps): Promise<Blog[]> => {
  const locale = await getCurrentLocale(props)
  return getAllContentByLocale(allBlogs as Blog[], locale) as Blog[]
}

const getAllAuthors = async (props?: PageProps): Promise<Authors[]> => {
  const locale = await getCurrentLocale(props)
  return getAllContentByLocale(allAuthors as Authors[], locale) as Authors[]
}

const getAllTags = async (props?: PageProps): Promise<Record<string, number>> => {
  const locale = await getCurrentLocale(props)
  return tagData[locale]
}

const getAllProjects = async (props?: PageProps): Promise<Project[]> => {
  const locale = await getCurrentLocale(props)
  return allProjects[locale]
}

const getTranslation = async (props?: PageProps): Promise<TranslationFn> => {
  const locale = await getCurrentLocale(props)
  return (text: TranslationText, ...args: (string | number)[]) => {
    return translationHelperFn(locale, text, ...args)
  }
}

const getSiteMetadata = async (props?: PageProps): Promise<SiteMetadata> => {
  const locale = await getCurrentLocale(props)
  return siteMetadata[locale]
}

const getSEOLocale = async (props?: PageProps): Promise<string> => {
  const locale = await getCurrentLocale(props)
  return locale.replace('-', '_')
}

const getHeaderNavLinks = async (props?: PageProps): Promise<HeaderNavLink[]> => {
  const locale = await getCurrentLocale(props)
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
