/** @type {import("pliny/config").PlinyConfig & { locales: {"en":"English","ne":"Nepali"}} */
const siteMetadata = {
  title: 'लक्ष्मणको अक्षरहरू',
  author: 'लक्ष्मण शिवाकोटी',
  headerTitle: null,
  description:
    'एक विचारक, प्रश्नकर्ता अनि जिज्ञासु - लक्ष्मणका विचार, जिज्ञासा र प्रेरणाले भरिएको अक्षरहरू',
  language: 'ne',
  locale: 'ne',
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
  newsletter: {
    provider: '',
  },
  comments: {},
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: '/search.json',
    },
  },
  locales: {
    en: 'English',
    ne: 'Nepali',
  },
}

module.exports = siteMetadata
