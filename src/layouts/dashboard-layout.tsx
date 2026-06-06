'use client'

import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { UserProfile } from '@/components/shared/user-profile'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Bell, FileText, HelpCircle, LayoutDashboard, RadioReceiver, RotateCcw, ScanLine, Search, Users } from 'lucide-react'
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
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-[260px] flex-col bg-sidebar text-on-primary shadow-xl md:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6 mb-2">
          <RadioReceiver className="h-7 w-7 text-white" />
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">SIP-HT</h1>
        </div>

        <ScrollArea className="flex-1 w-full">
          <nav className="flex flex-col gap-1 w-full pb-6">
            {sidebarNavItems.map((item, index) => {
              const isActive = pathname === item.href
              const isFirstInSection = index === 0 || sidebarNavItems[index - 1].sectionKey !== item.sectionKey

              return (
                <div key={item.href} className="w-full">
                  {isFirstInSection && (
                    <p className="mt-6 mb-2 px-6 text-xs font-bold text-blue-300/80 uppercase tracking-wider">
                      {tSection(item.sectionKey)}
                    </p>
                  )}
                  <div className="px-4">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium text-[15px]',
                        isActive 
                          ? 'bg-white/10 text-white font-bold border-l-4 border-blue-400' 
                          : 'text-white/80 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
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
      <main className="flex-1 flex flex-col min-h-screen md:ml-[260px] w-full md:w-[calc(100%-260px)] bg-surface dark:bg-background">
        
        {/* TopAppBar */}
        <header className="bg-surface dark:bg-card shadow-sm flex justify-between items-center px-6 py-4 sticky top-0 z-40 transition-colors duration-200 border-b border-border/50">
          <h2 className="text-xl sm:text-2xl font-bold text-primary dark:text-inverse-primary truncate mr-4">HT-Care Dashboard</h2>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden lg:block w-64 xl:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 rounded-xl bg-card border-border/50 focus-visible:ring-primary h-10" 
                placeholder="Search..." 
                type="text"
              />
            </div>
            
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted hidden sm:block">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted hidden sm:block">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas (scaled for large screens) */}
        <div className="p-6 max-w-[1440px] mx-auto w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
