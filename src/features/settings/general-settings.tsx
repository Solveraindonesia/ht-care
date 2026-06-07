'use client'

import { setLocale } from '@/actions/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Globe, Laptop, Moon, Sun } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'

export function GeneralSettings(): React.JSX.Element {
  const t = useTranslations('settings')
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { theme, setTheme } = useTheme()

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return
    startTransition(async () => {
      await setLocale(newLocale)
      router.refresh()
    })
  }

  const themeOptions = [
    {
      value: 'light',
      label: t('general.themes.light'),
      icon: Sun,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
    },
    {
      value: 'dark',
      label: t('general.themes.dark'),
      icon: Moon,
      color: 'text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20'
    },
    {
      value: 'system',
      label: t('general.themes.system'),
      icon: Laptop,
      color: 'text-slate-500 bg-slate-50 dark:bg-slate-950/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Card 1: Language Settings */}
      <Card className="bg-card border-border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-lg font-bold">
            <Globe className="text-primary h-5 w-5" />
            {t('general.language')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">{t('general.languageDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="language-select">{t('general.language')}</Label>
            <Select value={locale} onValueChange={handleLocaleChange} disabled={isPending}>
              <SelectTrigger id="language-select" className="border-border bg-card rounded-xl">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Indonesia (ID)</SelectItem>
                <SelectItem value="en">English (EN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Theme Settings */}
      <Card className="bg-card border-border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-lg font-bold">
            <Sun className="text-primary h-5 w-5 dark:hidden" />
            <Moon className="text-primary hidden h-5 w-5 dark:block" />
            {t('general.theme')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">{t('general.themeDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon
              const isSelected = theme === opt.value

              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-300 hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary dark:border-primary-fixed dark:bg-primary-fixed/10'
                      : 'border-border bg-card text-on-surface-variant hover:border-muted-foreground/50'
                  )}
                >
                  <div className={cn('mb-3 rounded-full p-3', opt.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
