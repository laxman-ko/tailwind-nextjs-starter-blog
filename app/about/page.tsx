import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { getAllAuthors, type Authors } from 'app/contentlayer.utils.server'

export const runtime = 'edge'

export const generateMetadata = async () => genPageMetadata({ title: 'About' })

export default async function Page() {
  const allAuthors = await getAllAuthors()
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
