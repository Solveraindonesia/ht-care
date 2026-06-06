'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export function UserProfile() {
  const { data: session } = useSession()
  const t = useTranslations('common') // Assumes we add logout to common.json or similar

  if (!session?.user) {
    return null
  }

  const initials = session.user.name ? session.user.name.substring(0, 2).toUpperCase() : 'US'

  return (
    <div className="border-border mt-auto flex flex-col gap-4 border-t p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={''} alt={session.user.name || 'User'} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="max-w-[120px] truncate text-sm font-semibold">{session.user.name || session.user.email}</span>
          <span className="text-muted-foreground text-xs capitalize">{session.user.role.toLowerCase()}</span>
        </div>
      </div>
      <Button variant="secondary" className="w-full justify-start text-sm" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
        <LogOut className="mr-2 h-4 w-4" />
        {t('logout') || 'Logout'}
      </Button>
    </div>
  )
}
