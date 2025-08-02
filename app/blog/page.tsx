import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { type NextPageProps, getAllBlogsByLocale, translate } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

export const generateMetadata = async (props: NextPageProps) => {
  const _t = await translate(props)
  const locale = (await props.searchParams).locale
  return genPageMetadata({ title: _t('Blog'), locale })
}

export default async function BlogPage(props: NextPageProps) {
  const allBlogs = await getAllBlogsByLocale(props)
  const _t = await translate(props)
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
