import { allAuthors, allBlogs } from 'contentlayer/generated'
import projectsData from '@/data/projectsData'

export const getAllAuthors = (locale: string) => {
  return allAuthors.filter((item) => item.locale === locale)
}

export const getAllBlogs = (locale: string) => {
  return allBlogs.filter((item) => item.locale === locale)
}

export const getAllProjects = (locale: string) => {
  return projectsData.filter((item) => item.locale === locale)
}
