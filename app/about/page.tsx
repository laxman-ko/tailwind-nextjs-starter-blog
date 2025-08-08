import { Authors, getAllAuthors, getCurrentLocale } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export async function generateMetadata() {
  return genPageMetadata({ title: 'About' })
}

export default async function Page() {
  const allAuthors = await getAllAuthors()
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)
  const locale = await getCurrentLocale()

  return (
    <>
      <AuthorLayout content={mainContent} locale={locale}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
