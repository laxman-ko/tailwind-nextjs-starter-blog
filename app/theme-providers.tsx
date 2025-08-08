'use client'

import { ThemeProvider } from 'next-themes'
import { getSiteMetadata } from 'contentlayer/generated'

export async function ThemeProviders({ children }: { children: React.ReactNode }) {
  const siteMetadata = await getSiteMetadata()
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
