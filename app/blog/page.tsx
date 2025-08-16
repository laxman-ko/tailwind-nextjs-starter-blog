import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { getAllBlogs } from 'app/helpers'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { translate } from '@/data/translations'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 5

const _t = translate(siteMetadata.defaultLocale)
const allBlogs = getAllBlogs(siteMetadata.defaultLocale)

export const metadata = genPageMetadata({ title: _t('Blog') })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={_t('All Posts')}
    />
  )
}
