'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, QrCode, Radio, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function DashboardActions(): React.JSX.Element {
  const t = useTranslations('dashboard')

  const actions = [
    {
      title: t('scanBorrowTitle'),
      desc: t('scanBorrowDesc'),
      href: '/scan-borrow',
      icon: QrCode,
      color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'hover:border-blue-500/50 dark:hover:border-blue-400/50',
      badge: 'Scan'
    },
    {
      title: t('scanReturnTitle'),
      desc: t('scanReturnDesc'),
      href: '/scan-return',
      icon: QrCode,
      color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
      badge: 'Scan'
    },
    {
      title: t('addHtTitle'),
      desc: t('addHtDesc'),
      href: '/ht-data',
      icon: Radio,
      color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
      badge: 'Master'
    },
    {
      title: t('addBorrowerTitle'),
      desc: t('addBorrowerDesc'),
      href: '/borrower-data',
      icon: UserPlus,
      color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
      borderColor: 'hover:border-violet-500/50 dark:hover:border-violet-400/50',
      badge: 'Master'
    }
  ]

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display-md text-foreground text-xl font-bold tracking-tight">{t('quickActions')}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((act, idx) => {
          const Icon = act.icon
          return (
            <Link key={idx} href={act.href} className="group">
              <Card
                className={`bg-card border-border relative h-full overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${act.borderColor}`}
              >
                {/* Glowing backdrop shape */}
                <div
                  className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-linear-to-br ${act.color} opacity-70 blur-xl transition-opacity group-hover:opacity-100`}
                />

                <CardContent className="relative z-10 flex h-full flex-col justify-between p-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-xl bg-linear-to-br p-2.5 ${act.color} ${act.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                        {act.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-headline-sm text-foreground group-hover:text-primary text-base font-semibold transition-colors">
                        {act.title}
                      </h4>
                      <p className="text-muted-foreground font-body-md line-clamp-2 text-xs leading-relaxed">{act.desc}</p>
                    </div>
                  </div>

                  <div className="border-border/50 text-primary mt-4 flex items-center justify-between border-t pt-3 text-xs font-semibold dark:text-blue-400">
                    <span className="flex items-center gap-1 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      Go <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
