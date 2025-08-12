import { MetadataRoute } from 'next'
import { getSiteMetadata } from 'app/contentlayer.utils.server'

export const dynamic = 'force-static'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteMetadata = await getSiteMetadata()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
