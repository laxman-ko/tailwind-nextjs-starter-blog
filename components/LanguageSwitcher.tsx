import { locales, getLocalePath } from '@/data/locales'
import Link from './Link'

interface LanguageSwitcherProps {
  currentLocale: string
}

const LanguageSwitcher = ({ currentLocale }: LanguageSwitcherProps) => {
  const sortedLocales = [
    currentLocale,
    ...Object.keys(locales).filter((locale) => locale !== currentLocale),
  ]

  return (
    <>
      {sortedLocales.map((locale, index) => (
        <span key={locale}>
          {currentLocale === locale ? (
            <span className="cursor-default font-medium text-gray-500">{locales[locale]}</span>
          ) : (
            <Link href={getLocalePath(locale) || '/'}>{locales[locale]}</Link>
          )}
          {index < sortedLocales.length - 1 && ' • '}
        </span>
      ))}
    </>
  )
}

export default LanguageSwitcher
