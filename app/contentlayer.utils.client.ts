import tagData from './tag-data.json'
import siteMetadata from '@/data/siteMetadata'
import { usePathname } from 'next/navigation'
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

const useLocale = () => {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  return isValidLocale(String(locale)) ? (locale as Locale) : LOCALE_DEFAULT
}

const useAllTags = (): Record<string, number> => {
  const locale = useLocale()
  return tagData[locale]
}

const useTranslation = () => {
  const locale = useLocale()
  return (text: TranslationText, ...args: (string | number)[]) => {
    return translationHelperFn(locale, text, ...args)
  }
}

const useSiteMetadata = (): SiteMetadata => {
  const locale = useLocale()
  return siteMetadata[locale]
}

const useHeaderNavLinks = (): HeaderNavLink[] => {
  const locale = useLocale()
  return headerNavLinks[locale]
}

export { useAllTags, useTranslation, useSiteMetadata, useHeaderNavLinks }

export type { Blog, Authors } from '.contentlayer/generated'
export type { Locale, TranslationText }
