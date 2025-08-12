'use client'

import { ThemeProvider } from 'next-themes'
import { getSiteMetadataByLocale } from 'app/contentlayer.utils.client'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  const siteMetadata = getSiteMetadataByLocale()
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
