'use client'

import { ThemeProvider } from 'next-themes'
import { getSiteHelpers } from 'app/helpers'

const { siteMetadata } = getSiteHelpers()

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
