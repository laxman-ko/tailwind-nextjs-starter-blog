import { NewsletterAPI } from 'pliny/newsletter'
import { getSiteHelpers } from 'app/helpers'

const { siteMetadata } = getSiteHelpers()

export const runtime = 'edge'

const handler = NewsletterAPI({
  // @ts-ignore
  provider: siteMetadata.newsletter.provider,
})

export { handler as GET, handler as POST }
