import siteMetadata from './siteMetadata'

const translations = {
  'Previous post: %%': {
    en: 'Previous post: %%',
    ne: 'अघिल्लो लेख: %%',
  },
  'Next post: %%': {
    en: 'Next post: %%',
    ne: 'अर्को लेख: %%',
  },
  'Load Comments': {
    en: 'Load Comments',
    ne: 'टिप्पणीहरू लोड गर्नुहोस्',
  },
  'Next post': {
    en: 'Next post',
    ne: 'अर्को लेख',
  },
  'Previous post': {
    en: 'Previous post',
    ne: 'अघिल्लो लेख',
  },
  'All posts': {
    en: 'All posts',
    ne: 'सबै लेखहरु',
  },
  'Read more': {
    en: 'Read more',
    ne: 'थप पढ्नुहोस',
  },
  'No tags found.': {
    en: 'No tags found.',
    ne: 'कुनै ट्याग फेला परेनन्।',
  },
  'Showcase your projects with a hero image (16 x 9)': {
    en: 'Showcase your projects with a hero image (16 x 9)',
    ne: 'आफ्ना प्रोजेक्टहरू १६×९ को हिरो छविसँग प्रस्तुत गर्नुहोस',
  },
  Authors: {
    en: 'Authors',
    ne: 'लेखकहरू',
  },
  Twitter: {
    en: 'Twitter',
    ne: 'Twitter',
  },
  Name: {
    en: 'Name',
    ne: 'नाम',
  },
  'Discuss on Twitter': {
    en: 'Discuss on Twitter',
    ne: 'Twitter मा छलफल गर्नुहोस',
  },
  'View on GitHub': {
    en: 'View on GitHub',
    ne: 'GitHub मा हेर्नुहोस',
  },
  'Back to the blog': {
    en: 'Back to the blog',
    ne: 'लेखहरूमा फर्कनुहोस',
  },
  'Published on': {
    en: 'Published on',
    ne: 'प्रकाशित मिति',
  },
  'Search articles': {
    en: 'Search articles',
    ne: 'लेखहरू खोज्नुहोस',
  },
  'No posts found.': {
    en: 'No posts found.',
    ne: 'कुनै लेख फेला परेन।',
  },
  'View posts tagged %%': {
    en: 'View posts tagged %%',
    ne: '%% ट्याग गरिएको लेखहरू',
  },
  Tags: {
    en: 'Tags',
    ne: 'ट्यागहरू',
  },
  'Things I blog about': {
    en: 'Things I blog about',
    ne: 'म जे बारेमा लेख्छु',
  },
  'tagged content': {
    en: 'tagged content',
    ne: 'ट्याग गरिएको सामग्री',
  },
  Blog: {
    en: 'Blog',
    ne: 'लेखहरू',
  },
  'Back to homepage': {
    en: 'Back to homepage',
    ne: 'गृहपृष्ठमा फर्किनुहोस',
  },
  'But dont worry, you can find plenty of other things on our homepage.': {
    en: 'But dont worry, you can find plenty of other things on our homepage.',
    ne: 'तर चिन्ता नलिनुहोस्, तपाईं हाम्रो गृहपृष्ठमा धेरै अरू सामग्रीहरू फेला पार्न सक्नुहुन्छ।',
  },
  "Sorry we couldn't find this page.": {
    en: "Sorry we couldn't find this page.",
    ne: 'माफ गर्नुहोस्, हामी यो पृष्ठ फेला पार्न सकिएनौं।',
  },
  'Read "%%"': {
    en: 'Read "%%"',
    ne: '"%%" पढ्नुहोस',
  },
  Projects: {
    en: 'Projects',
    ne: 'परियोजनाहरू',
  },
  About: {
    en: 'About',
    ne: 'मेरो बारेमा',
  },
  Mail: {
    en: 'Mail',
    ne: 'इमेल',
  },
  Light: {
    en: 'Light',
    ne: 'प्रकाशमान',
  },
  Dark: {
    en: 'Dark',
    ne: 'अँध्यारो',
  },
  System: {
    en: 'System',
    ne: 'प्रणाली',
  },
  Search: {
    en: 'Search',
    ne: 'खोज्नुहोस',
  },
  Subscribe: {
    en: 'Subscribe',
    ne: 'सदस्यता लिनुहोस',
  },
  Newsletter: {
    en: 'Newsletter',
    ne: 'समाचार पत्र',
  },
  'Next Article': {
    en: 'Next Article',
    ne: 'अर्को लेख',
  },
  'Published On': {
    en: 'Published On',
    ne: 'प्रकाशित मिति',
  },
  'Previous Article': {
    en: 'Previous Article',
    ne: 'अघिल्लो लेख',
  },
  'Learn More': {
    en: 'Learn More',
    ne: 'थप जान्नुहोस',
  },
  Next: {
    en: 'Next',
    ne: 'अर्को',
  },
  'Read More': {
    en: 'Read More',
    ne: 'थप पढ्नुहोस',
  },
  'All Posts': {
    en: 'All Posts',
    ne: 'सबै लेखहरु',
  },
  Previous: {
    en: 'Previous',
    ne: 'अघिल्लो',
  },
  Latest: {
    en: 'Latest',
    ne: 'ताजा लेखहरु',
  },
}

/**
 * @typedef {keyof typeof translations} TranslationKey
 */

/**
 * @param {TranslationKey} text - Must be one of the keys from 'translations'
 * @param {...string} args - Optional replacement args for %%
 * @returns {string}
 */

export const _t = (text, ...args) => {
  const locale = siteMetadata.locale
  const template = translations[text]?.[locale] || text
  let i = 0
  return template.replace(/%%/g, () => {
    return args[i++]?.toString() || ''
  })
}
