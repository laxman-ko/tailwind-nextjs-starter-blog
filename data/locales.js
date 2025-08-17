const defaultLocale = 'ne'

const locales = {
  en: 'English',
  ne: 'नेपाली',
}

const getLocalePath = (locale) => {
  const [localeCode, countryCode] = locale.split('-')
  const localeSlugs = [countryCode, localeCode].filter(Boolean)
  if (locale === defaultLocale) return ''
  return '/' + localeSlugs.join('/').toLowerCase()
}

module.exports = {
  locales,
  defaultLocale,
  getLocalePath,
}
