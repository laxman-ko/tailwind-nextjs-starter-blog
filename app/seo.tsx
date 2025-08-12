import { Metadata } from 'next'
import { getSiteMetadata, getTranslation, getSEOLocale } from 'app/contentlayer.utils.server'
import { Locale } from 'app/contentlayer.helpers'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export async function genPageMetadata({
  title: _title,
  description: _description,
  image,
  ...rest
}: PageSEOProps): Promise<Metadata> {
  const siteMetadata = await getSiteMetadata()
  const _t = await getTranslation()
  const title = _t(_title as Locale)
  const description = _t(_description as Locale)

  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: await getSEOLocale(),
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
