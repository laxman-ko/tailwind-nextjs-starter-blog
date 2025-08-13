import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import Main from './Main'
import { getAllBlogs } from 'app/contentlayer.utils.server'

export const runtime = 'edge'

export default async function Page() {
  const allBlogs = await getAllBlogs()
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
