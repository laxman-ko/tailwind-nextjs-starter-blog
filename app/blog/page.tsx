import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { getAllBlogs, getTranslationPage, getCurrentLocale } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

export async function generateMetadata() {
  return genPageMetadata({ title: 'Blog' })
}

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const _t = await getTranslationPage()
  const locale = await getCurrentLocale()
  const allBlogs = await getAllBlogs()
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
      locale={locale}
    />
  )
}
