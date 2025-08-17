/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import { getSiteHelpers } from 'app/helpers'
import { defaultLocale } from '@/data/locales'

const { siteMetadata } = getSiteHelpers()

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    let finalHref = href
    if (siteMetadata.locale !== defaultLocale) {
      if (href === '/') finalHref = `/${siteMetadata.locale}`
      else finalHref = `/${siteMetadata.locale}${href}`
    }
    return <Link className="break-words" href={finalHref} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}

export default CustomLink
