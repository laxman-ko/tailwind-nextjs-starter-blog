import { NextRequest } from 'next/server'
import siteMetadataLocailzed from '@/data/siteMetadata'
import { defaultLocale } from '@/data/locales'

const siteMetadata = siteMetadataLocailzed[defaultLocale]

export const runtime = 'edge'

export const GET = async (req: NextRequest) => {
  try {
    const url = req.nextUrl
    const cfEnv = url.searchParams.get('cfEnv')

    const redeployHookUrl =
      cfEnv === 'production1'
        ? siteMetadata.deployHooks.production
        : cfEnv === 'preview1'
          ? siteMetadata.deployHooks.preview
          : null

    if (!redeployHookUrl) return new Response('Invalid deployment environment', { status: 400 })

    await fetch(redeployHookUrl, {
      method: 'POST',
    })

    return new Response('Deployed to ' + cfEnv, { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to deploy - Reason: ' + error.message, { status: 500 })
  }
}
