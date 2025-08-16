import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { getSiteHelpers } from 'app/helpers'
import Main from './Main'

const { allBlogs } = getSiteHelpers()

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
