import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { getAllBlogsByLocale } from 'contentlayer/generated'
import Main from './Main'
import { type NextPageProps, translate } from 'contentlayer/generated'

export default async function Page(props: NextPageProps) {
  const allBlogs = await getAllBlogsByLocale(props)
  const _t = await translate(props)
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} _t={_t} />
}
