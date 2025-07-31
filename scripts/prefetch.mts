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

async function preContent() {
  console.log('Prefetching of notion database started...')

  const root = process.cwd()
  const DEFAULT_AUTHOR = 'laxman-siwakoti'
  const DEFAULT_LOCALE = 'en'
  const ARTICLES_DIR = `${root}/data/blog`
  const AUTHORS_DIR = `${root}/data/authors`

  const SITE_METADATA_FILE = `${root}/data/siteMetadata.js`
  const HEADER_NAV_LINKS_FILE = `${root}/data/headerNavLinks.ts`
  const FOOTER_NAV_LINKS_FILE = `${root}/data/footerNavLinks.ts`
  const LOGO_FILE = `${root}/data/logo.svg`

  const TRASNSLATIONS_TEXT_FILE = `${root}/lib/translations/translations.text.json`

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

      if (!personId) throw new Error('Person not found')

      const name = authorProperties['Name'].title[0].plain_text
      const slug =
        authorProperties['Slug'].url === DEFAULT_AUTHOR ? 'default' : authorProperties['Slug'].url

      authors[personId] = slug

      const frontmatter = {
        name,
        avatar: authorProperties['Avatar'].files[0].file.url,
        occupation: authorProperties['Occupation']?.rich_text?.[0]?.plain_text,
        company: authorProperties['Company']?.rich_text?.[0]?.plain_text,
        email: authorProperties['Email'].email,
        tiktok: authorProperties['Tiktok'].url,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      await fs.writeFile(`${AUTHORS_DIR}/${slug}.mdx`, mdxContent)
    })
  )

  // fetch all articles
  Promise.all(
    (await getListOfAllArticles()).map(async (article) => {
      const { properties: articleProperties } = article
      const mdContent = await getPageMarkDownById(article.id)

      const title = articleProperties['Name'].title[0].plain_text
      const slug = articleProperties['Slug'].url || title
      const personId = articleProperties.Author?.people?.[0]?.id

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
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      await fs.writeFile(`${ARTICLES_DIR}/${slug}.mdx`, mdxContent)
    })
  )

  // fetch all translations
  const translations = await getListOfAllTranslations()
  const translationsData = Object.fromEntries(
    translations.map((translation) => {
      const locales = Object.keys(translation.properties).filter(
        (locale) => locale !== DEFAULT_LOCALE
      )
      const enText = translation.properties[DEFAULT_LOCALE].title[0].plain_text
      return [
        enText,
        Object.fromEntries([
          [DEFAULT_LOCALE, enText],
          ...locales.map((locale: 'ne-NP') => {
            return [locale, translation.properties[locale].rich_text?.[0]?.plain_text]
          }),
        ]),
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

  settingsJson.translations = translationsData

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
  const logoContent = await fetch(logo, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
  }).then((res) => res.arrayBuffer())
  await fs.writeFile(LOGO_FILE, Buffer.from(logoContent))

  // fetch all navigations

  const hierarchialNavigationList: Record<string, { href: string; title: string }[]> = {}
  const navigations = await getListOfAllNavigations()

  navigations.forEach((navigation) => {
    // @ts-expect-error 'relation'
    const navigationItemRelation = navigation.properties['Parent item'].relation
    const isParentItem = navigationItemRelation.length === 0
    const navigationName = navigation.properties['Name'].title[0].plain_text
    if (isParentItem) {
      hierarchialNavigationList[navigationName] = []
    } else {
      const parentNavigation =
        navigations.find((navigation) => navigation.id === navigationItemRelation[0].id) || null
      const parentNavigationTitle = parentNavigation?.properties['Name'].title[0].plain_text || ''
      hierarchialNavigationList[parentNavigationTitle].push({
        href: navigation.properties.href.url,
        title: navigationName,
      })
    }
  })

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

  console.log('Prefetching of notion database completed')
}

preContent()
