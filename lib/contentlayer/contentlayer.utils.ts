import { DocumentTypes } from '.contentlayer/generated'
import { Locale } from '@/lib/i18n/i18n.utils'
import { allBlogs, allAuthors } from '.contentlayer/generated'
import type { Blog, Authors } from '.contentlayer/generated'
import translationsText from '@/data/translations.json'

export { allBlogs, allAuthors } from '.contentlayer/generated'
export type { Blog, Authors } from '.contentlayer/generated'

export type TranslationTextKey = keyof typeof translationsText

export type NextPageProps = {
  params?: Promise<{ slug?: string[]; page?: string }>
  searchParams: Promise<{ locale: string }>
}

export const getAllContentByLocale = (content: DocumentTypes[], locale: Locale) => {
  return content.filter((item) => item.locale === locale) as DocumentTypes[]
}

export const getAllBlogsByLocale = async (props: NextPageProps): Promise<Blog[]> => {
  const locale = (await props.searchParams).locale as Locale
  return getAllContentByLocale(allBlogs as Blog[], locale) as Blog[]
}

export const getAllAuthorsByLocale = async (props: NextPageProps): Promise<Authors[]> => {
  const locale = (await props.searchParams).locale as Locale
  return getAllContentByLocale(allAuthors as Authors[], locale) as Authors[]
}

export const translate = async (props: NextPageProps) => {
  const locale = (await props.searchParams).locale as Locale
  return (text: TranslationTextKey, ...args: (string | number)[]): string => {
    const template = translationsText[text][locale] || text

    let i = 0
    return template.replace(/%%/g, () => {
      return args[i++]?.toString() || ''
    })
  }
}
