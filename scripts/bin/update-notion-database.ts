import { Client as NotionClient } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env.local',
})

const TRASNSLATIONS_DATABASE_ID = '23f072d93d028025b142ceba5b7029db'
const ARTICLES_DATABASE_ID = '23f072d93d028025b142ceba5b7029db'
const NAVIGATION_DATABASE_ID = '240072d93d0280f39213e50c43787455'
const AUTHORS_DATABASE_ID = '23f072d93d02808fb8b1d308f6ab39f4'

const notion = new NotionClient({
  auth: process.env.NOTION_API_KEY,
})

const runUpdates = async () => {
  await notion.databases
    .update({
      database_id: TRASNSLATIONS_DATABASE_ID,
      properties: {
        Locale: {
          name: 'Locale',
          type: 'select',
          select: {
            options: [
              {
                name: 'ne-NP',
                color: 'green',
              },
              {
                name: 'en-US',
                color: 'brown',
              },
            ],
          },
        },
      },
    })
    .then((res) => {
      console.log(res)
    })

  // notion.databases.query({
  //     database_id: '23f072d93d028025b142ceba5b7029db',
  // }).then((res) => {
  //     console.log(res.results[0].properties['Locale'].select)
  // })
}

runUpdates()
