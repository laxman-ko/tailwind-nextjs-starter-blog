import { NextRequest } from 'next/server'

export const runtime = 'edge'

export const GET = async (req: NextRequest) => {
  try {
    const url = req.nextUrl
    const cfEnv = url.searchParams.get('cfEnv')

    const redeployHookUrl =
      cfEnv === 'production1'
        ? 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/065a4b52-b960-4f41-a398-5da36c8e2757'
        : cfEnv === 'preview1'
          ? 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/935bed83-9f22-42c9-9fb8-90d1acf5004f'
          : null

    if (!redeployHookUrl) return new Response('Invalid deployment environment', { status: 400 })

    await fetch(redeployHookUrl, {
      method: 'POST',
    })

    return new Response('Deployed to ' + cfEnv, { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to deploy', { status: 500 })
  }
}
