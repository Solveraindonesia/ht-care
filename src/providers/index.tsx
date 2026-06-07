'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children, locale, messages }: { children: React.ReactNode; locale: string; messages: AbstractIntlMessages }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
