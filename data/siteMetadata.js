/** @type {import("pliny/config").PlinyConfig } & { isUnderConstruction: boolean, defaultLocale: string, locale: string } */
const siteMetadata = {
  locale: 'en',
  defaultLocale: 'ne',
  isUnderConstruction: true,
  title: 'Laxman ko Aksharharu',
  author: 'Laxman Siwakoti',
  headerTitle: '',
  description:
    "A thinker, questioner and curious - Laxman's letters filled with thoughts, curiosity and inspirations",
  language: 'en',
  theme: 'system',
  siteUrl: 'https://akshar.laxmanko.com',
  siteRepo: 'https://github.com/laxmanko/akshar',
  siteLogo: 'static/images/logo.png',
  socialBanner: 'static/images/twitter-card.png',
  email: 'akshar@laxmanko.com',
  x: 'https://twitter.com/laxman_ko',
  youtube: 'https://youtube.com/@laxman_ko',
  tiktok: 'https://tiktok.com/@laxman_ko',
  stickyNav: false,
  analytics: {
    googleAnalytics: {
      googleAnalyticsId: 'G-CLPM8DXYKY',
    },
  },
  newsletter: {},
  comments: {},
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: '/search.json',
    },
  },
}

module.exports = siteMetadata
