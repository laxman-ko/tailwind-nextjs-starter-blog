import {
  Authors,
  type NextPageProps,
  allAuthors,
  getAllAuthorsByLocale,
  translate,
} from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export async function generateMetadata(props: NextPageProps) {
  const locale = (await props.searchParams).locale
  const _t = await translate(props)
  return genPageMetadata({ title: _t('About'), locale })
}

export default async function Page(props: NextPageProps) {
  const allAuthors = await getAllAuthorsByLocale(props)
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
