import tagData from './tag-data.json'
import siteMetadata from '@/data/siteMetadata'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  getLocaleFromPathname,
  HeaderNavLink,
  Locale,
  SiteMetadata,
  translationHelperFn,
  TranslationText,
  isValidLocale,
  LOCALE_DEFAULT,
} from './contentlayer.helpers'
import headerNavLinks from '@/data/headerNavLinks'

const getLocale = (): Locale => {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  return isValidLocale(String(locale)) ? (locale as Locale) : LOCALE_DEFAULT
}

const getAllTagsByLocale = (): Record<string, number> => {
  const locale = getLocale()
  return tagData[locale]
}

const getTranslationByLocale = () => {
  const locale = getLocale()
  return (text: TranslationText, ...args: (string | number)[]) => {
    return translationHelperFn(locale, text, ...args)
  }
}

const getSiteMetadataByLocale = (): SiteMetadata => {
  const locale = getLocale()
  return siteMetadata[locale]
}

const getHeaderNavLinksByLocale = (): HeaderNavLink[] => {
  const locale = getLocale()
  return headerNavLinks[locale]
}

export {
  getAllTagsByLocale,
  getTranslationByLocale,
  getSiteMetadataByLocale,
  getHeaderNavLinksByLocale,
}

export type { Blog, Authors } from '.contentlayer/generated'
export type { Locale, TranslationText }
