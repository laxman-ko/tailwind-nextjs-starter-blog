'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import { getSiteMetadataByLocale, getTranslationByLocale } from 'app/contentlayer.utils.client'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const siteMetadata = getSiteMetadataByLocale()
  const _t = getTranslationByLocale()

  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      ) : (
        <button onClick={() => setLoadComments(true)}>{_t('Load Comments')}</button>
      )}
    </>
  )
}
