import { MetadataRoute } from 'next'
import { getSiteHelpers } from 'app/helpers'

const { siteMetadata } = getSiteHelpers()

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
