'use client'

import { setLocale } from '@/actions/locale'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('common.language')

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === locale) return
    await setLocale(newLocale)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLocaleChange('id')}>{t('id')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange('en')}>{t('en')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
