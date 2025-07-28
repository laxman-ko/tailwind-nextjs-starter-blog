/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'लक्ष्मणको अक्षरहरू',
  author: 'लक्ष्मण शिवाकोटी',
  headerTitle: undefined,
  description: 'एक विचारक, प्रश्नकर्ता अनि जिज्ञासु - लक्ष्मणका विचार, जिज्ञासा र प्रेरणाले भरिएको अक्षरहरू',
  language: 'ne',
  theme: 'system', // system, dark or light
  siteUrl: 'https://akshar.laxmanko.com',
  siteRepo: 'https://github.com/laxmanko/akshar',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'akshar@laxmanko.com',
  x: 'https://twitter.com/laxman_ko',
  // twitter: 'https://twitter.com/Twitter',
  youtube: 'https://youtube.com/@laxman_ko',
  tiktok: 'https://tiktok.com/@laxman_ko',
  locale: 'ne-NP',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  analytics: {
    googleAnalytics: {
      googleAnalyticsId: 'G-CLPM8DXYKY', // e.g. G-XXXXXXX
    },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    // Please add your .env file and modify it according to your selection
    provider: '',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: 'ne',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
  },
  translations: {
    latest: 'ताजा पोस्टहरू',
    allPosts: 'सबै पोस्टहरू',
    previous: 'अघिल्लो',
    next: 'अर्को',
    readMore: 'थप पढ्नुहोस्',
    learnMore: 'थप जान्नुहोस्',
    previousArticle: 'अघिल्लो लेख',
    nextArticle: 'अर्को लेख',
    publishedOn: 'प्रकाशित मिति',
    subscribe: 'सदस्यता लिनुहोस्',
    newsletter: 'समाचार पत्र',
    search: 'खोज्नुहोस्',
    system: 'प्रणाली',
    dark: 'अँध्यारो',
    light: 'प्रकाशमान',
    mail: 'इमेल',
    about: 'बारेमा',
    projects: 'परियोजनाहरू',
  },
}

module.exports = siteMetadata
