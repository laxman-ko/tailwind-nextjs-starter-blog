import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { defaultLocale } from '@/data/locales'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: Object.keys(siteMetadata).map(
      (locale) => `${siteMetadata[locale].siteUrl}/sitemap.xml`
    ),
    host: siteMetadata[defaultLocale].siteUrl,
  }
}
