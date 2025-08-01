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
import { TranslationsProperties } from '@/lib/notion/notion.types'
import { getLocaleByName, LOCALE_NAME } from 'i18n/i18n.locales'

type HierarchialListItem = {
  title: string
  properties: PageObjectResponse['properties']
  children: HierarchialListItem[]
}

export const downloadAsset = async (
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

export const sortedHierarchialList = (list: PageObjectResponse[]) => {
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
      hierarchialList[parentId].children.push({ title, properties, children: [] })
    } else {
      hierarchialList[item.id] = { title, properties, children: [] }
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
  const FOOTER_NAV_LINKS_FILE = `${root}/data/footerNavLinks.ts`

  const TRASNSLATIONS_TEXT_FILE = `${root}/data/translations.json`
  const TYPES_FILE = `${root}/data/types.ts`

  const DEFAULT_LANGUAGE_FOR_TRANSLATIONS = 'en'

  for (const dir of [ARTICLES_DIR, AUTHORS_DIR]) {
    try {
      await fs.rm(dir, { recursive: true, force: true })
    } catch (e) {
      console.log(e)
    }
    await fs.mkdir(dir, { recursive: true })
  }

  await getListOfChildDatabases(process.env.NOTION_DATABASE_ID as string)

  const authors: Record<string, string> = {}

  // fetch all authors
  Promise.all(
    (await getListOfAllAuthors()).map(async (author) => {
      const { properties: authorProperties } = author
      const mdContent = await getPageMarkDownById(author.id)

      const personId = author.properties.Person?.people?.[0]?.id
      const localeName = authorProperties['Locale'].select?.name

      if (!personId) throw new Error('Person not found')
      if (!localeName) return

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
        locale: getLocaleByName(localeName as LOCALE_NAME),
        localizedSlugs: undefined,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      await fs.writeFile(`${AUTHORS_DIR}/${slug}.mdx`, mdxContent)
    })
  )

  // fetch all articles
  const articles = await getListOfAllArticles()
  const sortedArticles = sortedHierarchialList(articles)

  Promise.all(
    articles.map(async (article) => {
      const { properties: articleProperties } = article
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
        locale: getLocaleByName(localeName as LOCALE_NAME),
        localizedSlugs: undefined,
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
  )

  // fetch all translations
  const translations = await getListOfAllTranslations()
  const translationsData = Object.fromEntries(
    translations.map((translation) => {
      const locales = Object.keys(translation.properties).filter(
        (locale) => locale !== DEFAULT_LANGUAGE_FOR_TRANSLATIONS
      )
      const enText = translation.properties[DEFAULT_LANGUAGE_FOR_TRANSLATIONS].title[0].plain_text
      return [
        enText,
        Object.fromEntries(
          locales.map((locale: keyof TranslationsProperties) => {
            // @ts-expect-error 'rich_text'
            return [locale, translation.properties[locale].rich_text?.[0]?.plain_text]
          })
        ),
      ]
    })
  )

  fs.writeFile(TRASNSLATIONS_TEXT_FILE, JSON.stringify(translationsData, null, 2))

  // fetch all settings
  const settings = await getSettings()
  const jsonCode = settings.find((setting) => setting.type === 'code')?.code
  if (!jsonCode) throw new Error('JSON code not found')

  const settingsJson = JSON.parse(jsonCode?.rich_text[0].plain_text as string) as Record<
    string,
    string | object
  >

  await fs.writeFile(
    SITE_METADATA_FILE,
    `
    /** @type {import("pliny/config").PlinyConfig } */
    const siteMetadata = ${JSON.stringify(settingsJson)}
    module.exports = siteMetadata;
    `
  )

  const logoImage = settings.find((setting) => setting.type === 'image')?.image
  if (!logoImage) throw new Error('Logo not found')
  // @ts-expect-error 'file'
  const logo = logoImage?.caption[0].plain_text === 'Logo' ? logoImage?.file.url : ''

  // download content of logo file and save to LOGO_FILE
  await downloadAsset(logo, `${root}/data/logo`, root)

  // fetch all navigations

  const hierarchialNavigationList: Record<string, { href: string; title: string }[]> = {}
  const navigations = await getListOfAllNavigations()

  const sortedNavigations = sortedHierarchialList(navigations)

  Object.entries(sortedNavigations).forEach(([_, navigationItem]) => {
    // @ts-expect-error 'title'
    const navigationName = navigationItem.properties.Name.title[0].plain_text
    hierarchialNavigationList[navigationName] = navigationItem.children.map((item) => {
      return {
        // @ts-expect-error 'url'
        href: item.properties.href.url,
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

  await fs.writeFile(
    FOOTER_NAV_LINKS_FILE,
    `
  const footerNavLinks = ${JSON.stringify(hierarchialNavigationList['Footer'])}
  export default footerNavLinks`
  )

  await fs.writeFile(TYPES_FILE, `export type Locale = 'en' | 'ne-NP' | 'en-US'`)

  console.log('Prefetching of notion database completed')
}

preContent()
