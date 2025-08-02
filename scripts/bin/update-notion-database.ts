import { Client as NotionClient } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env.local',
})

const TRASNSLATIONS_DATABASE_ID = '240072d93d0280f28543da631c2f2a88'
const ARTICLES_DATABASE_ID = '23f072d93d028025b142ceba5b7029db'
const NAVIGATION_DATABASE_ID = '240072d93d0280f39213e50c43787455'
const AUTHORS_DATABASE_ID = '23f072d93d02808fb8b1d308f6ab39f4'
const SETTINGS_DATABASE_ID = '243072d93d0280e3abb2c4b07a570833'

const settingsItems = [
  { name: 'title', en: "Laxman's Letters", ne: 'लक्ष्मणको अक्षरहरू' },
  { name: 'author', en: 'Laxman Siwakoti', ne: 'लक्ष्मण शिवाकोटी' },
  { name: 'headerTitle', en: '', ne: '' },
  {
    name: 'description',
    en: "A thinker, questioner and curious - Laxman's letters filled with thoughts, curiosity and inspirations",
    ne: 'एक विचारक, प्रश्नकर्ता अनि जिज्ञासु - लक्ष्मणका विचार, जिज्ञासा र प्रेरणाले भरिएको अक्षरहरू',
  },
  { name: 'language', en: 'ne', ne: 'ne' },
  { name: 'locale', en: 'ne', ne: 'ne' },
  { name: 'theme', en: 'system', ne: 'system' },
  { name: 'siteUrl', en: 'https://akshar.laxmanko.com', ne: 'https://akshar.laxmanko.com' },
  {
    name: 'siteRepo',
    en: 'https://github.com/laxmanko/akshar',
    ne: 'https://github.com/laxmanko/akshar',
  },
  { name: 'siteLogo', en: 'static/images/logo.png', ne: 'static/images/logo.png' },
  {
    name: 'socialBanner',
    en: 'static/images/twitter-card.png',
    ne: 'static/images/twitter-card.png',
  },
  { name: 'email', en: 'akshar@laxmanko.com', ne: 'akshar@laxmanko.com' },
  { name: 'x', en: 'https://twitter.com/laxman_ko', ne: 'https://twitter.com/laxman_ko' },
  { name: 'youtube', en: 'https://youtube.com/@laxman_ko', ne: 'https://youtube.com/@laxman_ko' },
  { name: 'tiktok', en: 'https://tiktok.com/@laxman_ko', ne: 'https://tiktok.com/@laxman_ko' },
  { name: 'stickyNav', en: 'false', ne: 'false' },
  {
    name: 'analytics',
    en: '{"googleAnalytics": {"googleAnalyticsId": "G-CLPM8DXYKY"}}',
    ne: '{"googleAnalytics": {"googleAnalyticsId": "G-CLPM8DXYKY"}}',
  },
  { name: 'newsletter', en: '{}', ne: '{}' },
  { name: 'comments', en: '{}', ne: '{}' },
  {
    name: 'search',
    en: '{"provider": "kbar", "kbarConfig": {"searchDocumentsPath": "/search.json"}}',
    ne: '{"provider": "kbar", "kbarConfig": {"searchDocumentsPath": "/search.json"}}',
  },
  {
    name: 'locales',
    en: '{"en": "English", "ne": "Nepali"}',
    ne: '{"en": "अंग्रेजी", "ne": "नेपाली"}',
  },
]

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

const addNewItemsToDatabse = async (database_id: string) => {
  const settingsItemsReversed = [...settingsItems].reverse()

  for (const item of settingsItemsReversed) {
    await notion.pages.create({
      parent: { database_id },
      properties: {
        Name: {
          title: [{ type: 'text', text: { content: item.name } }],
        },
        en: {
          rich_text: [{ type: 'text', text: { content: item.en } }],
        },
        ne: {
          rich_text: [{ type: 'text', text: { content: item.ne } }],
        },
      },
    })
  }
}

// runUpdates(ARTICLES_DATABASE_ID)
// runUpdates(AUTHORS_DATABASE_ID)

addNewItemsToDatabse(SETTINGS_DATABASE_ID)
