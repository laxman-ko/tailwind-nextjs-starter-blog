/** @type {{ [locale: string]: import("pliny/config").PlinyConfig & { isUnderConstruction: boolean, defaultLocale: string }}} */
const siteMetadata = {
  en: {
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
  },
  ne: {
    locale: 'ne',
    defaultLocale: 'ne',
    isUnderConstruction: true,
    title: 'लक्ष्मणको अक्षरहरू',
    author: 'लक्ष्मण शिवाकोटी',
    headerTitle: '',
    description:
      'एक विचारक, प्रश्नकर्ता अनि जिज्ञासु - लक्ष्मणका विचार, जिज्ञासा र प्रेरणाले भरिएको अक्षरहरू',
    language: 'ne',
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
  },
}

module.exports = siteMetadata
