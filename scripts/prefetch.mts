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

let defaultSiteLocale
let siteMetadata = {} as Record<string, Record<string, string | object>>

const getLocaleByName = (language: string): string => {
  return Object.keys(locales).find((locale: string) => locales[locale] === language) as string
}

export const getLocalePath = (locale: Locale): string => {
  const [localeCode, countryCode] = locale.split('-')
  const localeSlugs = [countryCode, localeCode].filter(Boolean)
  if (locale === defaultSiteLocale) return ''
  return '/' + localeSlugs.join('/').toLowerCase()
}

export const withLocalePath = (path: string, locale: Locale): string => {
  const localePath = getLocalePath(locale)
  return (localePath + path).replace(/\/$/, '')
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

  const locales = Object.keys(settings[0].properties).filter((key) => key !== 'Name')

  const settingsJson = {} as Record<string, Record<string, string | object>>

  defaultSiteLocale =
    settings.find((setting) => {
      return setting.properties.Name.title[0].plain_text === 'defaultLocale'
    })?.properties['ne'].rich_text?.[0]?.plain_text || 'ne'

  settings.forEach((setting) => {
    const settingName = setting.properties.Name.title[0].plain_text
    // @ts-expect-error 'rich_text'
    const defaultValue = setting.properties[defaultSiteLocale].rich_text?.[0]?.plain_text

    locales.forEach((locale) => {
      if (!settingsJson[locale])
        settingsJson[locale] = {
          locale,
          localeSlug: getLocalePath(locale),
        }
      // @ts-expect-error 'rich_text'
      const value = setting.properties[locale].rich_text?.[0]?.plain_text || defaultValue
      try {
        settingsJson[locale][settingName] = JSON.parse(value)
      } catch (error) {
        settingsJson[locale][settingName] = value
      }
    })
  })

  siteMetadata = settingsJson as typeof siteMetadata

  await fs.writeFile(
    SITE_METADATA_FILE,
    `
/** @type {{ [locale: string]: import("pliny/config").PlinyConfig & { isUnderConstruction: boolean, defaultLocale: string, localeSlug: string }}} */
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
        locale,
        localizedSlugs,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      await fs.writeFile(`${AUTHORS_DIR}/${slug}__${locale}.mdx`, mdxContent)
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
        locale,
        localizedSlugs,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      const mdxFile = `${ARTICLES_DIR}/${slug}__${locale}.mdx`
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
    const translations = ${JSON.stringify(translationsData, null, 2)}
    
    /**
     * @typedef {keyof typeof translations} TranslationKey
     * @typedef {keyof typeof translations[TranslationKey]} LocaleKey
     */

    /**
     * Creates a translate function for a given locale
     *
     * @param {string} locale - The locale code (e.g. 'en', 'ne')
     * @returns {(text: TranslationKey, ...args: string[]) => string}
     */

    export const translate = (locale) => {
      return (text, ...args) => {
        const template = translations[text]?.[locale] || text
        let i = 0
        return template.replace(/%%/g, () => {
          return args[i++]?.toString() || ''
        })
      }
    }
  `
  )

  // fetch all navigations

  const hierarchialNavigationList: Record<
    string,
    Record<string, { href: string; title: string }[]>
  > = {}
  const navigations = await getListOfAllNavigations()

  const sortedNavigations = sortedHierarchialList(navigations)

  Object.entries(sortedNavigations).forEach(([_, navigationItem]) => {
    // @ts-expect-error 'title'
    const navigationNameWithLocale = navigationItem.properties.Name.title[0].plain_text
    const [navigationName, locale = siteMetadata.defaultLocale] =
      navigationNameWithLocale.split('__')
    if (!hierarchialNavigationList[navigationName]) {
      hierarchialNavigationList[navigationName] = {}
    }
    if (!hierarchialNavigationList[navigationName][locale]) {
      hierarchialNavigationList[navigationName][locale] = []
    }
    hierarchialNavigationList[navigationName][locale] = navigationItem.children.map((item) => {
      return {
        // @ts-expect-error 'url'
        href: withLocalePath(item.properties.href.url, locale),
        // @ts-expect-error 'title'
        title: item.properties.Name.title[0].plain_text,
      }
    })
  })

  console.log(hierarchialNavigationList)

  await fs.writeFile(
    HEADER_NAV_LINKS_FILE,
    `
  const headerNavLinks = ${JSON.stringify(hierarchialNavigationList['Header'])}
  export default headerNavLinks`
  )

  console.log('Prefetching of notion database completed')
}

preContent()
