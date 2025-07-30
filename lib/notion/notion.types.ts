import { BlockObjectResponse, PageObjectResponse } from '@notionhq/client'

export type ChildDatabase = {
  id: string
  title: string
}

export type ArticleProperties = {
  'Created time': {
    id: string
    type: 'created_time'
    created_time: string // ISO date string
  }
  Summary: {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
  'Published On': {
    id: string
    type: 'date'
    date: {
      start: string
      end: string | null
      time_zone: string | null
    }
  }
  Status: {
    id: string
    type: 'status'
    status: {
      id: string
      name: string
      color: string
    }
  }
  Tags: {
    id: string
    type: 'multi_select'
    multi_select: Array<{
      id: string
      name: string
      color: string
    }>
  }
  Slug: {
    id: string
    type: 'url'
    url: string
  }
  ID: {
    id: string
    type: 'unique_id'
    unique_id: {
      prefix: string
      number: number
    }
  }
  'Last Edited': {
    id: string
    type: 'last_edited_time'
    last_edited_time: string // ISO date string
  }
  Name: {
    id: string
    type: 'title'
    title: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
  Author: {
    id: string
    type: 'people'
    people: Array<{
      id: string
      name: string
      type: 'person'
      person: {
        email: string
      }
    }>
  }
}

export type Article = PageObjectResponse & {
  properties: ArticleProperties
}

export type AuthorProperties = {
  Name: {
    id: string
    type: 'title'
    title: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
  Slug: {
    id: string
    type: 'url'
    url: string
  }
  Email: {
    id: string
    type: 'email'
    email: string
  }
  Description: {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
  Occupation: {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
  Company: {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
  Person: {
    id: string
    type: 'people'
    people: Array<{
      id: string
      name: string
      type: 'person'
      person: {
        email: string
      }
    }>
  }
  Tiktok: {
    id: string
    type: 'url'
    url: string
  }
  Instagram: {
    id: string
    type: 'url'
    url: string
  }
  Twitter: {
    id: string
    type: 'url'
    url: string
  }
  Avatar: {
    id: string
    type: 'files'
    files: Array<{
      name: string
      type: 'file'
      file: {
        url: string
      }
    }>
  }
}

export type Author = PageObjectResponse & {
  properties: AuthorProperties
}

export type TranslationsProperties = {
  en: {
    id: string
    type: 'title'
    title: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
  'ne-NP': {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  }
}

export type Translations = PageObjectResponse & {
  properties: TranslationsProperties
}

export type Settings = BlockObjectResponse

export type NavigationProperties = {
  Name: {   
    id: string
    type: 'title'
    title: Array<{ 
      type: 'text'
      text: {
        content: string
        link: string | null
      }
      annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
      }
      plain_text: string
      href: string | null
    }>
  };
  href: {
    id: string
    type: 'url'
    url: string
  }
}

export type Navigation = PageObjectResponse & {
  properties: NavigationProperties
}