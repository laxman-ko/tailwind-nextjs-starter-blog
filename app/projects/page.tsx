import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import { translate } from '@/data/translations'
import siteMetadata from '@/data/siteMetadata'
import { getAllProjects } from 'app/helpers'

const _t = translate(siteMetadata.defaultLocale)
const projectsData = getAllProjects(siteMetadata.defaultLocale)

export const metadata = genPageMetadata({ title: _t('Projects') })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {_t('Projects')}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {_t('Showcase your projects with a hero image (16 x 9)')}
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
