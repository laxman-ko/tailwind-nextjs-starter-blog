import { allAuthors, allBlogs } from 'contentlayer/generated'
import projectsData from '@/data/projectsData'
import siteMetadata from '@/data/siteMetadata'
import { translate } from '@/data/translations'
import tagData from 'app/tag-data.json'
import headerNavLinks from '@/data/headerNavLinks'
import { defaultLocale } from '@/data/locales'

const getAllAuthors = (locale: string) => {
  return allAuthors.filter((item) => item.locale === locale)
}

const getAllBlogs = (locale: string) => {
  return allBlogs.filter((item) => item.locale === locale)
}

const getAllProjects = (locale: string) => {
  return projectsData.filter((item) => item.locale === locale)
}

const getSiteSettings = (locale: string) => {
  return siteMetadata[locale]
}

const getAllTags = (locale: string) => {
  return tagData[locale]
}

const getHeaderNavLinks = (locale: string) => {
  return headerNavLinks[locale]
}

export const getSiteHelpers = (locale?: string) => {
  const siteLocale = locale || defaultLocale
  if (!siteLocale) {
    throw new Error('No default locale found')
  }
  return {
    allAuthors: getAllAuthors(siteLocale),
    allBlogs: getAllBlogs(siteLocale),
    projectsData: getAllProjects(siteLocale),
    siteMetadata: getSiteSettings(siteLocale),
    tagData: getAllTags(siteLocale),
    headerNavLinks: getHeaderNavLinks(siteLocale),
    _t: translate(siteLocale),
  }
}
