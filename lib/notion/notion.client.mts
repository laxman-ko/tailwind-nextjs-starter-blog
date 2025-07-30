import { BlockObjectResponse, Client as NotionClient, PageObjectResponse } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { ChildDatabase, Article, Author, Translations, Settings, Navigation } from './notion.types'
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'

const notion = new NotionClient({ auth: process.env.NOTION_API_KEY })
const n2m = new NotionToMarkdown({ notionClient: notion })

const listOfChildDatabases: ChildDatabase[] = []

export const getListOfAllDatabaseItems = async (
  query: QueryDatabaseParameters
): Promise<PageObjectResponse[]> => {
  const pageItems: PageObjectResponse[] = []

  try {
    let cursor: string | undefined = undefined

    while (true) {
      const fullOrPartialPages = await notion.databases.query({
        ...query,
        start_cursor: cursor,
      })

      fullOrPartialPages.results.forEach((page: PageObjectResponse) => {
        pageItems.push(page)
      })

      if (!fullOrPartialPages.has_more) break
      cursor = fullOrPartialPages?.next_cursor as string
    }
  } catch (error) {
    console.error(error)
  }

  return pageItems
}

export const getListofAllPageBlocks = async (id: string): Promise<BlockObjectResponse[]> => {
  return await notion.blocks.children.list({ block_id: id }).then((res) => res.results as BlockObjectResponse[])
}

export const getListOfChildDatabases = async (databaseId: string): Promise<ChildDatabase[]> => {
  const databaseList: BlockObjectResponse[] = []

  if (listOfChildDatabases.length > 0) return listOfChildDatabases

  try {
    let cursor: string | undefined = undefined
    while (true) {
      const listBlockChildrenResponse = await notion.blocks.children.list({
        block_id: databaseId,
        start_cursor: cursor,
      })

      listBlockChildrenResponse.results.forEach((block: BlockObjectResponse) => {
        databaseList.push(block)
      })
      if (!listBlockChildrenResponse.has_more) break
      cursor = listBlockChildrenResponse?.next_cursor as string
    }
  } catch (error) {
    console.error(error)
  }

  databaseList
    .filter((item: BlockObjectResponse) => item.type === 'child_database' || (item.type === 'child_page'))
    .forEach((item: BlockObjectResponse) => {
      listOfChildDatabases.push({
        id: item.id,
        // @ts-expect-error 'child_database"
        title: item.child_database?.title || item.child_page?.title || 'Unknown',
      })
    })
  return listOfChildDatabases
}

export const getListOfAllArticles = async (): Promise<Article[]> => {
  const articleDabaseId = listOfChildDatabases.find(
    (item: ChildDatabase) => item.title === 'Articles'
  )?.id

  if (!articleDabaseId) throw new Error('Article database not found')

  const pages = await getListOfAllDatabaseItems({ database_id: articleDabaseId })

  return pages as Article[]
}

export const getListOfAllAuthors = async (): Promise<Author[]> => {
  const authorDabaseId = listOfChildDatabases.find(
    (item: ChildDatabase) => item.title === 'Authors'
  )?.id

  if (!authorDabaseId) throw new Error('Author database not found')

  const pages = await getListOfAllDatabaseItems({ database_id: authorDabaseId })

  return pages as Author[]
}

export const getListOfAllTranslations = async (): Promise<Translations[]> => {
  const translationsDabaseId = listOfChildDatabases.find(
    (item: ChildDatabase) => item.title === 'Translations'
  )?.id

  if (!translationsDabaseId) throw new Error('Translations database not found')

  const pages = await getListOfAllDatabaseItems({ database_id: translationsDabaseId })

  return pages as Translations[]
}

export const getSettings = async (): Promise<Settings> => {
  const settingsDabaseId = listOfChildDatabases.find(
    (item: ChildDatabase) => item.title === 'Settings'
  )?.id

  if (!settingsDabaseId) throw new Error('Settings database not found')

  const blockList = await getListofAllPageBlocks(settingsDabaseId)
  return blockList.find((block: BlockObjectResponse) => block.type === 'code') as BlockObjectResponse
}

export const getListOfAllNavigations = async (): Promise<Navigation[]> => {
  const navigationDabaseId = listOfChildDatabases.find(
    (item: ChildDatabase) => item.title === 'Navigations'
  )?.id

  if (!navigationDabaseId) throw new Error('Navigation database not found')

  const pages = await getListOfAllDatabaseItems({ database_id: navigationDabaseId })

  // sort page where properties Parent Item's relation is empty array on top
  const sortPagesByParentItem = pages.sort((a, b) => {
    // @ts-expect-error 'relation'
    if (a.properties['Parent item'].relation.length === 0) return -1
    // @ts-expect-error 'relation'
    if (b.properties['Parent item'].relation.length === 0) return 1
    return 0
  })

  return sortPagesByParentItem as Navigation[]
}

export const getPageMarkDownById = async (id: string): Promise<string | null> => {
  try {
    const mdblocks = await n2m.pageToMarkdown(id)
    const mdString = n2m.toMarkdownString(mdblocks)
    return mdString.parent
  } catch (error) {
    console.error(error)
    return null
  }
}
