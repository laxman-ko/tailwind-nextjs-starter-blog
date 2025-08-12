import { MetadataRoute } from 'next'
import { getAllBlogs, getSiteMetadata } from 'app/contentlayer.utils.server'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteMetadata = await getSiteMetadata()
  const siteUrl = siteMetadata.siteUrl
  const allBlogs = await getAllBlogs()
  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
