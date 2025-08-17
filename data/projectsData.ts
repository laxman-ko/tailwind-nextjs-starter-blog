export interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  locale: string
}

const projectsData: Project[] = [
  {
    title: 'A Search Engine',
    description: `What if you could look up any information in the world? Webpages, images, videos
    and more. Google has many features to help you find exactly what you're looking
    for.`,
    imgSrc: '/static/images/google.png',
    href: 'https://www.google.com',
    locale: 'en',
  },
  {
    title: 'The Time Machine',
    description: `Imagine being able to travel back in time or to the future. Simple turn the knob
    to the desired date and press "Go". No more worrying about lost keys or
    forgotten headphones with this simple yet affordable solution.`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '/en/blog/the-time-machine',
    locale: 'en',
  },
  {
    title: 'Nepali Test',
    description: `Nepali Test`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '/ne/blog/the-time-machine',
    locale: 'ne',
  },
]

export default projectsData
