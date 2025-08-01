const LOCALES_WITH_NAMES = {
  en: 'English',
  ne: 'Nepali',
} as const

export type LOCALE = keyof typeof LOCALES_WITH_NAMES
export type LOCALE_NAME = (typeof LOCALES_WITH_NAMES)[LOCALE]

export const getLocaleByName = (language: LOCALE_NAME): LOCALE => {
  return Object.keys(LOCALES_WITH_NAMES).find(
    (locale: LOCALE) => LOCALES_WITH_NAMES[locale] === language
  ) as LOCALE
}

export const getLocaleName = (locale: LOCALE): LOCALE_NAME => {
  return LOCALES_WITH_NAMES[locale]
}
