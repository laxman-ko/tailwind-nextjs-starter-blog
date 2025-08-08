'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'

export function ThemeProviders({ children, theme }: { children: React.ReactNode; theme: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
