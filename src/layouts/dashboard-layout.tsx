'use client'

import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { UserProfile } from '@/components/shared/user-profile'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { FileText, LayoutDashboard, RadioReceiver, RotateCcw, ScanLine, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { useTranslations } from 'next-intl'

const sidebarNavItems = [
  {
    titleKey: 'dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    sectionKey: 'main'
  },
  {
    titleKey: 'dataHt',
    href: '/data-ht',
    icon: RadioReceiver,
    sectionKey: 'masterData'
  },
  {
    titleKey: 'dataBorrower',
    href: '/data-peminjam',
    icon: Users,
    sectionKey: 'masterData'
  },
  {
    titleKey: 'scanBorrow',
    href: '/scan-pinjam',
    icon: ScanLine,
    sectionKey: 'transaction'
  },
  {
    titleKey: 'scanReturn',
    href: '/scan-kembali',
    icon: RotateCcw,
    sectionKey: 'transaction'
  },
  {
    titleKey: 'logHistory',
    href: '/riwayat-log',
    icon: FileText,
    sectionKey: 'report'
  }
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const tNav = useTranslations('sidebar.nav')
  const tSection = useTranslations('sidebar.sections')

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#1e3a8a] text-white md:flex">
        <div className="flex h-16 shrink-0 items-center px-6">
          <RadioReceiver className="mr-2 h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">SIP-HT</span>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-4">
            {sidebarNavItems.map((item, index) => {
              const isActive = pathname === item.href
              const isFirstInSection = index === 0 || sidebarNavItems[index - 1].sectionKey !== item.sectionKey

              return (
                <React.Fragment key={item.href}>
                  {isFirstInSection && (
                    <h4 className="mt-4 mb-2 px-2 text-xs font-semibold tracking-wider text-blue-200 uppercase">{tSection(item.sectionKey)}</h4>
                  )}
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'bg-blue-600/50 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {tNav(item.titleKey)}
                  </Link>
                </React.Fragment>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Profile Section at bottom of sidebar */}
        <div className="mt-auto bg-[#172d6e]">
          <UserProfile />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-background flex h-16 shrink-0 items-center justify-end gap-4 border-b px-6">
          <LanguageSwitcher />
          <ThemeToggle />
        </header>

        {/* Page Content */}
        <main className="bg-muted/20 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
