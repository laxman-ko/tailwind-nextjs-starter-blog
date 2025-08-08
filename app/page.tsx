import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { getAllBlogs } from 'contentlayer.utils.server'
import Main from './Main'

export default async function Page() {
  const blogs = await getAllBlogs()
  const sortedPosts = sortPosts(blogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
