import siteMetadata from '@/data/siteMetadata'
import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMetadata.en.siteUrl}/sitemap.xml`,
    host: siteMetadata.en.siteUrl,
  }
}
