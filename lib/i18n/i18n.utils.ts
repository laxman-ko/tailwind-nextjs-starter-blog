import siteMetadata from '@/data/siteMetadata'

const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/

export const getLocaleByPathname = (pathname: string): string => {
  const [_, language, country] = pathname.match(LANGUAGE_COUNTRY_MATCH_REGEX) ?? []
  return language ?? siteMetadata.language
}
