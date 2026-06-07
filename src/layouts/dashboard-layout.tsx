'use client'

import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { UserProfile } from '@/components/shared/user-profile'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bell,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Menu,
  RadioReceiver,
  RotateCcw,
  ScanLine,
  Search,
  Settings,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
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
    href: '/ht-data',
    icon: RadioReceiver,
    sectionKey: 'masterData'
  },
  {
    titleKey: 'dataBorrower',
    href: '/borrower-data',
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
  },
  {
    titleKey: 'report',
    href: '/laporan',
    icon: BarChart,
    sectionKey: 'report'
  },
  {
    titleKey: 'settings',
    href: '/settings',
    icon: Settings,
    sectionKey: 'preferences'
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
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-sidebar text-on-primary fixed top-0 left-0 z-50 hidden h-full w-[260px] flex-col shadow-xl md:flex">
        <div className="mb-2 flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <RadioReceiver className="h-7 w-7 text-white" />
          <h1 className="text-2xl leading-tight font-bold tracking-tight text-white">SIP-HT</h1>
        </div>

        <ScrollArea className="min-h-0 w-full flex-1">
          <nav className="flex w-full flex-col gap-1 pb-6">
            {sidebarNavItems.map((item, index) => {
              const isActive = pathname === item.href
              const isFirstInSection = index === 0 || sidebarNavItems[index - 1].sectionKey !== item.sectionKey

              return (
                <div key={item.href} className="w-full">
                  {isFirstInSection && (
                    <p className="mt-6 mb-2 px-6 text-xs font-bold tracking-wider text-blue-300/80 uppercase">{tSection(item.sectionKey)}</p>
                  )}
                  <div className="px-4">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                        isActive
                          ? 'border-l-4 border-blue-400 bg-white/10 font-bold text-white'
                          : 'border-l-4 border-transparent text-white/80 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {tNav(item.titleKey)}
                    </Link>
                  </div>
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Profile Section */}
        <div className="mt-auto border-t border-white/10">
          <UserProfile />
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="bg-surface dark:bg-background flex min-h-screen w-full flex-1 flex-col md:ml-[260px] md:w-[calc(100%-260px)]">
        {/* TopAppBar */}
        <header className="bg-surface dark:bg-card border-border/50 sticky top-0 z-40 flex items-center justify-between border-b px-6 py-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-muted-foreground hover:text-primary md:hidden">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-sidebar text-on-primary w-[260px] border-none p-0 outline-none">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation for the application</SheetDescription>
                <div className="mb-2 flex items-center gap-3 border-b border-white/10 px-6 py-6">
                  <RadioReceiver className="h-7 w-7 text-white" />
                  <h1 className="text-2xl leading-tight font-bold tracking-tight text-white">SIP-HT</h1>
                </div>

                <ScrollArea className="min-h-0 w-full flex-1">
                  <nav className="flex w-full flex-col gap-1 pb-6">
                    {sidebarNavItems.map((item, index) => {
                      const isActive = pathname === item.href
                      const isFirstInSection = index === 0 || sidebarNavItems[index - 1].sectionKey !== item.sectionKey

                      return (
                        <div key={item.href} className="w-full">
                          {isFirstInSection && (
                            <p className="mt-6 mb-2 px-6 text-xs font-bold tracking-wider text-blue-300/80 uppercase">{tSection(item.sectionKey)}</p>
                          )}
                          <div className="px-4">
                            <Link
                              href={item.href}
                              className={cn(
                                'flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                                isActive
                                  ? 'border-l-4 border-blue-400 bg-white/10 font-bold text-white'
                                  : 'border-l-4 border-transparent text-white/80 hover:bg-white/5 hover:text-white'
                              )}
                            >
                              <item.icon className="h-5 w-5" />
                              {tNav(item.titleKey)}
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </nav>
                </ScrollArea>
                <div className="mt-auto border-t border-white/10">
                  <UserProfile />
                </div>
              </SheetContent>
            </Sheet>
            <h2 className="text-primary dark:text-inverse-primary mr-4 truncate text-xl font-bold sm:text-2xl">HT-Care Dashboard</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden w-64 lg:block xl:w-80">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input className="bg-card border-border/50 focus-visible:ring-primary h-10 rounded-xl pl-10" placeholder="Search..." type="text" />
            </div>

            <button className="text-muted-foreground hover:text-primary hover:bg-muted hidden rounded-full p-2 transition-colors sm:block">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-primary hover:bg-muted hidden rounded-full p-2 transition-colors sm:block">
              <HelpCircle className="h-5 w-5" />
            </button>

            <div className="border-border ml-2 flex items-center gap-2 border-l pl-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas (scaled for large screens) */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col p-6">{children}</div>
      </main>
    </div>
  )
}
