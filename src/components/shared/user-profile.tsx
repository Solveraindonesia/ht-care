'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

interface UserProfileProps {
  isCollapsed?: boolean
}

export function UserProfile({ isCollapsed = false }: UserProfileProps): React.JSX.Element | null {
  const { data: session } = useSession()
  const t = useTranslations('common')

  if (!session?.user) {
    return null
  }

  const initials = session.user.name ? session.user.name.substring(0, 2).toUpperCase() : 'US'

  return (
    <div
      className={cn(
        'mt-auto flex flex-col border-t border-white/10 transition-all duration-300',
        isCollapsed ? 'items-center gap-3 p-2' : 'gap-4 p-4'
      )}
    >
      <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'gap-3')}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={''} alt={session.user.name || 'User'} />
                  <AvatarFallback className="bg-white/20 text-xs text-white">{initials}</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2 border border-white/10 bg-slate-900 p-2 text-white">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">{session.user.name || session.user.email}</span>
                <span className="text-[10px] text-slate-300 capitalize">{session.user.role.toLowerCase()}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={''} alt={session.user.name || 'User'} />
              <AvatarFallback className="bg-white/20 text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-white">
              <span className="max-w-[120px] truncate text-sm font-semibold">{session.user.name || session.user.email}</span>
              <span className="text-xs text-white/60 capitalize">{session.user.role.toLowerCase()}</span>
            </div>
          </>
        )}
      </div>

      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-white hover:bg-white/10 hover:text-white"
              onClick={(): Promise<undefined> => signOut({ callbackUrl: '/auth/login' })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2 border border-white/10 bg-slate-900 text-white">
            {t('logout') || 'Logout'}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          variant="secondary"
          className="w-full justify-start border-0 bg-white/10 text-sm text-white hover:bg-white/20"
          onClick={(): Promise<undefined> => signOut({ callbackUrl: '/auth/login' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('logout') || 'Logout'}
        </Button>
      )}
    </div>
  )
}
