interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Record<string, Project[]> = {
  en: [
    {
      title: 'English',
      description: '---',
      imgSrc: '/static/images/google.png',
      href: '#',
    },
  ],
  ne: [
    {
      title: 'Nepali',
      description: '---',
      imgSrc: '/static/images/google.png',
      href: '#',
    },
  ],
}

export default projectsData
