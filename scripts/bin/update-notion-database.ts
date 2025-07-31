import { Client as NotionClient } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env.local',
})

const notion = new NotionClient({
  auth: process.env.NOTION_API_KEY,
})

notion.databases
  .update({
    database_id: '23f072d93d028025b142ceba5b7029db',
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
              name: 'en',
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
