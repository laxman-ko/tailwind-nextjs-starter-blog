import { Metadata } from 'next'
import { getSiteMetadata, getTranslationPage, type TranslationText } from 'contentlayer/generated'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export async function genPageMetadata({
  title,
  description,
  image,
  ...rest
}: PageSEOProps): Promise<Metadata> {
  const siteMetadata = await getSiteMetadata()
  const _t = await getTranslationPage()
  const titleText = _t(title as TranslationText)
  const descriptionText = _t(description as TranslationText)
  return {
    title: titleText,
    description: descriptionText || siteMetadata.description,
    openGraph: {
      title: `${titleText} | ${siteMetadata.title}`,
      description: descriptionText || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: siteMetadata.locale.replace('-', '_'),
      type: 'website',
    },
    twitter: {
      title: `${titleText} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
