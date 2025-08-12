'use client'

import { ThemeProvider } from 'next-themes'
import { useSiteMetadata } from 'app/contentlayer.utils.client'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  const siteMetadata = useSiteMetadata()
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
