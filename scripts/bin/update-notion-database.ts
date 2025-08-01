import { Client as NotionClient } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env.local',
})

const TRASNSLATIONS_DATABASE_ID = '240072d93d0280f28543da631c2f2a88'
const ARTICLES_DATABASE_ID = '23f072d93d028025b142ceba5b7029db'
const NAVIGATION_DATABASE_ID = '240072d93d0280f39213e50c43787455'
const AUTHORS_DATABASE_ID = '23f072d93d02808fb8b1d308f6ab39f4'

const notion = new NotionClient({
  auth: process.env.NOTION_API_KEY,
})

const localesProperty = {
  Locale: {
    name: 'Locale',
    type: 'select',
    select: {
      options: [
        {
          name: 'Nepali',
          color: 'green',
        },
        {
          name: 'English',
          color: 'brown',
        },
      ],
    },
  },
}

const runUpdates = async (database_id: string) => {
  await notion.databases
    .update({
      database_id,
      properties: {
        ...localesProperty,
      },
    })
    .then((res) => {
      console.log(res)
    })
}

runUpdates(ARTICLES_DATABASE_ID)
runUpdates(AUTHORS_DATABASE_ID)
