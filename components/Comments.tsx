'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import { getSiteHelpers } from 'app/helpers'

const { siteMetadata, _t } = getSiteHelpers()

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

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
