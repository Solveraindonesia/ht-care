'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from '@/features/settings/general-settings'
import { PasswordSettings } from '@/features/settings/password-settings'
import { ProfileSettings } from '@/features/settings/profile-settings'
import { KeyRound, Settings, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function SettingsPage(): React.JSX.Element {
  const t = useTranslations('settings')

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
      {/* Page Header */}
      <div>
        <h2 className="text-on-surface font-display-lg text-2xl font-extrabold tracking-tight sm:text-3xl">{t('title')}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList variant="line" className="border-border/50 h-auto w-full justify-start gap-6 rounded-none border-b p-0">
          <TabsTrigger
            value="general"
            className="data-active:after:bg-primary data-active:text-primary dark:data-active:text-primary-fixed dark:data-active:after:bg-primary-fixed cursor-pointer rounded-none pb-3 text-sm font-semibold"
          >
            <Settings className="h-4 w-4" />
            {t('tabs.general')}
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="data-active:after:bg-primary data-active:text-primary dark:data-active:text-primary-fixed dark:data-active:after:bg-primary-fixed cursor-pointer rounded-none pb-3 text-sm font-semibold"
          >
            <User className="h-4 w-4" />
            {t('tabs.profile')}
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="data-active:after:bg-primary data-active:text-primary dark:data-active:text-primary-fixed dark:data-active:after:bg-primary-fixed cursor-pointer rounded-none pb-3 text-sm font-semibold"
          >
            <KeyRound className="h-4 w-4" />
            {t('tabs.password')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="animate-in fade-in slide-in-from-bottom-2 mt-6 duration-300">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-2 mt-6 duration-300">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="password" className="animate-in fade-in slide-in-from-bottom-2 mt-6 duration-300">
          <PasswordSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
