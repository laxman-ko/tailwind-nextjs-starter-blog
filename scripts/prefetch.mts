import fs from 'fs/promises'
import {
  getListOfAllAuthors,
  getListOfChildDatabases,
  getPageMarkDownById,
  getListOfAllTranslations,
  getSettings,
  getListOfAllArticles,
  getListOfAllNavigations,
} from '../lib/notion/notion.client.mjs'
import yaml from 'js-yaml'
import { PageObjectResponse } from '@notionhq/client'
import { ArticleProperties, AuthorProperties } from '../lib/notion/notion.types.js'

type HierarchialListItem = {
  id: string
  title: string
  properties: PageObjectResponse['properties']
  children: HierarchialListItem[]
}

const locales = {
  en: 'English',
  ne: 'Nepali',
} as Record<string, string>

const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/

type Locale = keyof typeof locales

export const isValidLocale = (locale: string): boolean => {
  return Object.keys(locales).includes(locale)
}

export const getLocaleFromPathname = (pathname?: string): Locale | 400 | null => {
  if (!pathname) return null
  // match /us/en/ (country/language) or /en/ (language)
  const [_, countryOrLanguageCode, languageCode] =
    pathname.match(LANGUAGE_COUNTRY_MATCH_REGEX) ?? []

  if (!countryOrLanguageCode) return null

  const locale = (
    languageCode ? `${languageCode}-${countryOrLanguageCode.toUpperCase()}` : countryOrLanguageCode
  ) as Locale

  if (!isValidLocale(locale)) return 400

  return locale
}

const DEFAULT_SITE_LOCALE = 'ne'
const siteMetadata = {
  locale: getLocaleFromPathname(process.env.BASE_PATH) || DEFAULT_SITE_LOCALE,
} as Record<string, string | object>

const getLocaleByName = (language: string): string => {
  return Object.keys(locales).find((locale: string) => locales[locale] === language) as string
}

const downloadAsset = async (
  url: string,
  relativeSavePathWithoutExt: string,
  root = ''
): Promise<string> => {
  const urlObj = new URL(url)
  const isPublic = relativeSavePathWithoutExt.includes('/public/')
  const fileContent = await fetch(urlObj.href).then((res) => res.arrayBuffer())

  const extension = urlObj.pathname.split('.').pop()

  const savedFileName = `${relativeSavePathWithoutExt}.${extension}`
  await fs.writeFile(savedFileName, Buffer.from(fileContent))

  const rootDir = isPublic ? root + '/public' : root

  return savedFileName.replace(rootDir, '')
}

const sortedHierarchialList = (list: PageObjectResponse[]) => {
  // sort page where properties Parent Item's relation is empty array on top
  const sortListByParentItem = list.sort((a, b) => {
    // @ts-expect-error 'relation'
    if (a.properties['Parent item'].relation.length === 0) return -1
    // @ts-expect-error 'relation'
    if (b.properties['Parent item'].relation.length === 0) return 1
    return 0
  })

  const hierarchialList: Record<string, HierarchialListItem> = {}
  sortListByParentItem.forEach((item) => {
    const { properties } = item
    // @ts-expect-error 'relation'
    const parentId = properties['Parent item']?.relation?.[0]?.id
    // @ts-expect-error 'title'
    const title = properties['Name'].title[0].plain_text
    if (parentId) {
      hierarchialList[parentId].children.push({ id: item.id, title, properties, children: [] })
    } else {
      hierarchialList[item.id] = { id: item.id, title, properties, children: [] }
    }
  })
  return hierarchialList
}

async function preContent() {
  console.log('Prefetching of notion database started...')

  const root = process.cwd()

  const PUBLIC_IMAGES_DIR = `${root}/public/static/images`

  const DEFAULT_AUTHOR = 'laxman-siwakoti'
  const ARTICLES_DIR = `${root}/data/blog`
  const AUTHORS_DIR = `${root}/data/authors`

  const SITE_METADATA_FILE = `${root}/data/siteMetadata.js`
  const HEADER_NAV_LINKS_FILE = `${root}/data/headerNavLinks.ts`

  const TRASNSLATIONS_TEXT_FILE = `${root}/data/translations.js`

  for (const dir of [ARTICLES_DIR, AUTHORS_DIR]) {
    try {
      await fs.rm(dir, { recursive: true, force: true })
    } catch (e) {
      console.log(e)
    }
    await fs.mkdir(dir, { recursive: true })
  }

  await getListOfChildDatabases(process.env.NOTION_DATABASE_ID as string)

  // fetch all settings
  const settings = await getSettings()
  if (settings.length === 0) throw new Error('Settings not found')

  settings.forEach((setting) => {
    const settingName = setting.properties.Name.title[0].plain_text
    const enValue = setting.properties['en']?.rich_text?.[0]?.plain_text

    // @ts-expect-error 'rich_text'
    const value = setting.properties[siteMetadata.locale]?.rich_text?.[0]?.plain_text || enValue
    try {
      siteMetadata[settingName] = JSON.parse(value)
    } catch (error) {
      siteMetadata[settingName] = value
    }
  })

  await fs.writeFile(
    SITE_METADATA_FILE,
    `
/** @type {import("pliny/config").PlinyConfig } & { isUnderConstruction: boolean, defaultLocale: string, locale: string } */
const siteMetadata = ${JSON.stringify(siteMetadata, null, 2)}

module.exports = siteMetadata
    `
  )

  const authors: Record<string, string> = {}

  // fetch all authors
  const authorsList = await getListOfAllAuthors()
  const sortedAuthorsList = sortedHierarchialList(authorsList)

  Object.keys(sortedAuthorsList).forEach(async (authorId) => {
    const author = sortedAuthorsList[authorId]
    const allAuthors = [author, ...author.children]

    const localizedSlugs = Object.fromEntries(
      allAuthors.map((author) => {
        // @ts-expect-error 'select'
        const localeName = author.properties['Locale']?.select?.name
        if (!localeName) return []
        // @ts-expect-error 'url'
        return [getLocaleByName(localeName), author.properties['Slug']?.url]
      })
    )

    allAuthors.forEach(async (author) => {
      const authorProperties = author.properties as unknown as AuthorProperties
      const mdContent = await getPageMarkDownById(author.id)

      const personId = authorProperties.Person?.people?.[0]?.id
      const localeName = authorProperties['Locale']?.select?.name

      if (!personId) throw new Error('Person not found')
      if (!localeName) return

      const locale = getLocaleByName(localeName)

      if (locale !== siteMetadata.locale) {
        console.log('Skip other locale', {
          locale,
          localeName,
        })
        return
      }

      const name = authorProperties['Name'].title[0].plain_text
      const authorSlug = authorProperties['Slug'].url
      const slug = authorSlug === DEFAULT_AUTHOR ? 'default' : authorSlug

      authors[personId] = slug

      const frontmatter = {
        name,
        avatar: await downloadAsset(
          authorProperties['Avatar'].files[0].file.url,
          `${PUBLIC_IMAGES_DIR}/${authorSlug}`,
          root
        ),
        occupation: authorProperties['Occupation']?.rich_text?.[0]?.plain_text,
        company: authorProperties['Company']?.rich_text?.[0]?.plain_text,
        email: authorProperties['Email'].email,
        tiktok: authorProperties['Tiktok'].url,
        localizedSlugs,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      await fs.writeFile(`${AUTHORS_DIR}/${slug}.mdx`, mdxContent)
    })
  })

  // fetch all articles
  const articles = await getListOfAllArticles()
  const sortedArticles = sortedHierarchialList(articles)

  Object.keys(sortedArticles).forEach((articleId) => {
    const hierarchialArticle = sortedArticles[articleId]
    if (!hierarchialArticle) return

    const allArticles = [hierarchialArticle, ...hierarchialArticle.children]

    const localizedSlugs = Object.fromEntries(
      allArticles.map((article) => {
        // @ts-expect-error 'select'
        const localeName = article.properties['Locale']?.select?.name
        if (!localeName) return []
        // @ts-expect-error 'url'
        return [getLocaleByName(localeName), article.properties['Slug']?.url]
      })
    )

    allArticles.forEach(async (article) => {
      const articleProperties = article.properties as unknown as ArticleProperties
      const mdContent = await getPageMarkDownById(article.id)

      const title = articleProperties['Name'].title[0].plain_text
      const slug = articleProperties['Slug'].url
      const personId = articleProperties.Author?.people?.[0]?.id
      const localeName = articleProperties['Locale'].select?.name

      if (!slug) {
        console.log('Slug not found', {
          title,
          slug,
          personId,
        })
        return
      }

      if (!localeName) {
        console.log('Locale not found', {
          title,
          slug,
          personId,
          a: articleProperties['Locale'],
        })
        return
      }

      const authorName = authors[personId] === DEFAULT_AUTHOR ? 'default' : authors[personId]

      const locale = getLocaleByName(localeName)

      if (locale !== siteMetadata.locale) {
        console.log('Skip other locale', {
          locale,
          localeName,
        })
        return
      }

      const frontmatter = {
        title,
        date: articleProperties['Created time'].created_time,
        tags: articleProperties.Tags.multi_select.map((tag) => tag.name),
        lastmod: articleProperties['Last Edited'].last_edited_time,
        draft: articleProperties['Status'].status.name === 'Draft',
        summary: articleProperties['Summary']?.rich_text?.[0]?.plain_text,
        images: undefined,
        authors: [authorName],
        layout: 'PostLayout',
        bibliography: undefined,
        canonicalUrl: undefined,
        localizedSlugs,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      const mdxFile = `${ARTICLES_DIR}/${slug}.mdx`
      try {
        await fs.access(mdxFile)
        throw new Error(`File ${mdxFile} already exists`)
      } catch (e) {
        console.log('New article found', {
          slug,
          mdxFile,
          title,
        })
      }

      await fs.writeFile(mdxFile, mdxContent)
    })
  })

  // fetch all translations
  const translations = await getListOfAllTranslations()
  const translationsData = Object.fromEntries(
    translations.map((translation) => {
      const defaultLocaleName = 'English'
      const locales = Object.keys(translation.properties).filter(
        (locale) => locale !== defaultLocaleName
      )
      // @ts-expect-error 'title'
      const enText = translation.properties[defaultLocaleName].title[0].plain_text
      return [
        enText,
        Object.fromEntries([
          [getLocaleByName(defaultLocaleName), enText],
          ...locales.map((localeName: string) => {
            return [
              getLocaleByName(localeName),
              // @ts-expect-error 'rich_text'
              translation.properties[localeName].rich_text?.[0]?.plain_text,
            ]
          }),
        ]),
      ]
    })
  )

  fs.writeFile(
    TRASNSLATIONS_TEXT_FILE,
    `
    import siteMetadata from "./siteMetadata"

    const translations = ${JSON.stringify(translationsData, null, 2)}
    
    /**
     * @typedef {keyof typeof translations} TranslationKey
     */

    /**
     * @param {TranslationKey} text - Must be one of the keys from 'translations'
     * @param {...string} args - Optional replacement args for %%
     * @returns {string}
     */

    export const _t = (text, ...args) => {
      const locale = siteMetadata.locale
      const template = translations[text]?.[locale] || text
      let i = 0
      return template.replace(/%%/g, () => {
        return args[i++]?.toString() || ''
      })
    }
  `
  )

  // fetch all navigations

  const hierarchialNavigationList: Record<string, { href: string; title: string }[]> = {}
  const navigations = await getListOfAllNavigations()

  const sortedNavigations = sortedHierarchialList(navigations)

  Object.entries(sortedNavigations).forEach(([_, navigationItem]) => {
    // @ts-expect-error 'title'
    const navigationNameWithLocale = navigationItem.properties.Name.title[0].plain_text
    const [navigationName, locale = siteMetadata.locale] = navigationNameWithLocale.split('__')
    if (locale !== siteMetadata.locale) {
      console.log('Skip other locale', {
        locale,
        navigationName,
      })
      return
    }
    hierarchialNavigationList[navigationName] = navigationItem.children.map((item) => {
      return {
        // @ts-expect-error 'url'
        href: item.properties.href.url,
        // @ts-expect-error 'title'
        title: item.properties.Name.title[0].plain_text,
      }
    })
  })

  await fs.writeFile(
    HEADER_NAV_LINKS_FILE,
    `
  const headerNavLinks = ${JSON.stringify(hierarchialNavigationList['Header'])}
  export default headerNavLinks`
  )

  console.log('Prefetching of notion database completed')
}

preContent()
