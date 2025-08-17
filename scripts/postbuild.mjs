import rss from './rss.mjs'
import siteMetadataLocalized from '../data/siteMetadata.js'
async function postbuild() {
  for (const locale of Object.keys(siteMetadataLocalized)) {
    await rss(siteMetadataLocalized[locale])
  }
}

postbuild()
