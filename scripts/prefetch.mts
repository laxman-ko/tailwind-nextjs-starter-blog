import fs from 'fs/promises'
import { getListOfAllAuthors, getListOfChildDatabases, getPageMarkDownById, getListOfAllTranslations, getSettings, getListOfAllArticles } from '../lib/notion/notion.client.mjs'
import yaml from 'js-yaml'

async function preContent() {

  console.log('Prefetching of notion database started...')

  const root = process.cwd()
  const DEFAULT_AUTHOR = 'laxman-siwakoti'
  const DEFAULT_LOCALE = 'en'
  const ARTICLES_DIR = `${root}/data/blog`
  const AUTHORS_DIR = `${root}/data/authors`

  const SITE_METADATA_FILE = `${root}/data/siteMetadata.js`

  try {
    await fs.rm(ARTICLES_DIR, { recursive: true })
    await fs.rm(AUTHORS_DIR, { recursive: true })
  } finally {
    await fs.mkdir(ARTICLES_DIR, { recursive: true })
    await fs.mkdir(AUTHORS_DIR, { recursive: true })
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

  const translations = await getListOfAllTranslations()
  const translationsData = Object.fromEntries(translations.map((translation) => {
    const locales = Object.keys(translation.properties).filter((locale) => locale !== DEFAULT_LOCALE)
    const enText = translation.properties[DEFAULT_LOCALE].title[0].plain_text
    return [
      enText,
      Object.fromEntries([[DEFAULT_LOCALE, enText], ...locales.map((locale: 'ne-NP') => {
        return [locale, translation.properties[locale].rich_text?.[0]?.plain_text]
      })]),
    ]
  }))


  const settings = await getSettings()
  const settingsJson = settings?.code?.rich_text[0].plain_text
  const settingsData = JSON.parse(settingsJson as string) as Record<string, any>

  settingsData.translations = translationsData

  await fs.writeFile(SITE_METADATA_FILE, `
    const siteMetadata = ${JSON.stringify(settingsData)}
    module.exports = siteMetadata;
    `)

  console.log('Prefetching of notion database completed')
}

preContent()
