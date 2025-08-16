import { Authors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { getAllAuthors } from 'app/helpers'
import { translate } from '@/data/translations'

const _t = translate(siteMetadata.defaultLocale)
const allAuthors = getAllAuthors(siteMetadata.defaultLocale)

export const metadata = genPageMetadata({ title: _t('About') })

export default function Page() {
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
