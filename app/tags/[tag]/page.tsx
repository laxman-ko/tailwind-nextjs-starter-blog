import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getAllBlogs, getAllTags, getCurrentLocale } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = await getAllTags()
  const tagKeys = Object.keys(tagCounts)
  return tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const locale = await getCurrentLocale()
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const allBlogs = await getAllBlogs()
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
      locale={locale}
    />
  )
}
