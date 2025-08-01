import { DocumentTypes } from '.contentlayer/generated'
import { getSiteLocale } from '@/lib/i18n/i18n.utils'
import { allBlogs, allAuthors } from '.contentlayer/generated'
import type { Blog, Authors } from '.contentlayer/generated'

export { allBlogs, allAuthors } from '.contentlayer/generated'
export type { Blog, Authors } from '.contentlayer/generated'

export const getAllContentByLocale = async (content: DocumentTypes[]) => {
  const locale = await getSiteLocale()
  if (!locale) return []

  return content.filter((item) => item.locale === locale)
}

export const getAllBlogsByLocale = async (): Promise<Blog[]> => {
  const blogs = await getAllContentByLocale(allBlogs as Blog[])
  return blogs as Blog[]
}

export const getAllAuthorsByLocale = async (): Promise<Authors[]> => {
  const authors = await getAllContentByLocale(allAuthors as Authors[])
  return authors as Authors[]
}
