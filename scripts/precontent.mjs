import {
  getListOfChildDatabases,
  getListOfAllAuthors,
  getListOfAllArticles,
  getPageMarkDownById,
} from '../lib/notion/notion.client'
import fs from 'fs/promises'
import yaml from 'js-yaml'

async function precontent() {
  const root = process.cwd()
  const ARTICLES_DIR = `${root}/data/blog`
  const AUTHORS_DIR = `${root}/data/authors`

  try {
    await fs.rm(ARTICLES_DIR, { recursive: true })
    await fs.rm(AUTHORS_DIR, { recursive: true })
  } finally {
    await fs.mkdir(ARTICLES_DIR, { recursive: true })
    await fs.mkdir(AUTHORS_DIR, { recursive: true })
  }

  await getListOfChildDatabases(process.env.NOTION_DATABASE_ID)

  const authors = {}

  // fetch all authors
  Promise.all(
    (await getListOfAllAuthors()).map(async (author) => {
      const { properties } = author
      const mdContent = await getPageMarkDownById(author.id)

      const personId = author.properties.Person?.people?.[0]?.id

      if (!personId) throw new Error('Person not found')

      const name = properties['Name'].title[0].plain_text
      const slug = properties['Slug'].url

      authors[personId] = slug

      const frontmatter = {
        name,
        avatar: properties['Avatar'].files[0].file.url,
        occupation: properties['Occupation']?.rich_text?.[0]?.plain_text,
        company: properties['Company']?.rich_text?.[0]?.plain_text,
        email: properties['Email'].email,
        tiktok: properties['Tiktok'].url,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      await fs.writeFile(`${AUTHORS_DIR}/${slug}.mdx`, mdxContent)
    })
  )

  // fetch all articles
  Promise.all(
    (await getListOfAllArticles()).map(async (article) => {
      const { properties } = article
      const mdContent = await getPageMarkDownById(article.id)

      const title = properties['Name'].title[0].plain_text
      const slug = properties['Slug'].url || title
      const personId = properties.Author?.people?.[0]?.id

      const frontmatter = {
        title,
        date: properties['Created time'].created_time,
        tags: [],
        lastmod: properties['Last Edited'].last_edited_time,
        draft: properties['Status'].status.name === 'Draft',
        summary: properties['Summary']?.rich_text?.[0]?.plain_text,
        images: undefined,
        authors: [authors[personId]],
        layout: 'PostLayout',
        bibliography: undefined,
        canonicalUrl: undefined,
      }
      const frontmatterYaml = `---\n${yaml.dump(frontmatter, { lineWidth: 100 })}\n---\n`
      const mdxContent = `${frontmatterYaml}\n\n${mdContent}`
      await fs.writeFile(`${ARTICLES_DIR}/${slug}.mdx`, mdxContent)
    })
  )
}

precontent()
