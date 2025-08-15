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
import { remark } from 'remark'
import html from 'remark-html'

const markdownToHtml = async (markdown: string) => {
  const result = await remark()
    .use(html, { sanitize: false }) // sanitize: false allows raw HTML in markdown
    .process(markdown)

  return result.toString()
}

const getLocaleAndSlugFromParams = (params: string[]) => {
  const slugWithLocale = decodeURI(params.join('/'))
  const slug = slugWithLocale.split('__')[0]
  const locale = slugWithLocale.split('__')[1] as Locale
  return { locale, slug }
}

const getCurrentLocale = async (localeCode?: Locale): Promise<Locale> => {
  const localeFromHeader = (await headers()).get(LOCALE_HEADER)
  const locale = localeCode || localeFromHeader

  if (!locale || !isValidLocale(locale)) throw new Error('Invalid locale page request:' + locale)
  return locale as Locale
}

const getAllContentByLocale = (content: DocumentTypes[], locale: Locale) => {
  return content.filter((item) => item.locale === locale) as DocumentTypes[]
}

const getAllBlogs = async (localeCode?: Locale): Promise<Blog[]> => {
  const locale = await getCurrentLocale(localeCode)
  return getAllContentByLocale(allBlogs as Blog[], locale) as Blog[]
}

const getAllAuthors = async (localeCode?: Locale): Promise<Authors[]> => {
  const locale = await getCurrentLocale(localeCode)
  return getAllContentByLocale(allAuthors as Authors[], locale) as Authors[]
}

const getAllTags = async (localeCode?: Locale): Promise<Record<string, number>> => {
  const locale = await getCurrentLocale(localeCode)
  return tagData[locale]
}

const getAllProjects = async (localeCode?: Locale): Promise<Project[]> => {
  const locale = await getCurrentLocale(localeCode)
  return allProjects[locale]
}

const getTranslation = async (localeCode?: Locale): Promise<TranslationFn> => {
  const locale = await getCurrentLocale(localeCode)
  return (text: TranslationText, ...args: (string | number)[]) => {
    return translationHelperFn(locale, text, ...args)
  }
}

const getSiteMetadata = async (localeCode?: Locale): Promise<SiteMetadata> => {
  const locale = await getCurrentLocale(localeCode)
  return siteMetadata[locale]
}

const getSEOLocale = async (localeCode?: Locale): Promise<string> => {
  const locale = await getCurrentLocale(localeCode)
  return locale.replace('-', '_')
}

const getHeaderNavLinks = async (localeCode?: Locale): Promise<HeaderNavLink[]> => {
  const locale = await getCurrentLocale(localeCode)
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
  markdownToHtml,
  getLocaleAndSlugFromParams,
}

export { LANGUAGE_COUNTRY_MATCH_REGEX, LOCALE_HEADER }

export type { Locale, TranslationFn, TranslationText }
