'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import { getSiteMetadataByLocale } from 'contentlayer.utils.client'

export default function Comments({ slug }: { slug: string }) {
  const siteMetadata = getSiteMetadataByLocale()
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
