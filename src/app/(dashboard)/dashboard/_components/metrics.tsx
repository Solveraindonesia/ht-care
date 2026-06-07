'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ReportMetrics as MetricsType } from '@/types/report'
import { CheckCircle2, History, RadioReceiver, Wrench } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface DashboardMetricsProps {
  metrics?: MetricsType
  isLoading: boolean
}

export function DashboardMetrics({ metrics, isLoading }: DashboardMetricsProps): React.JSX.Element {
  const t = useTranslations('dashboard')

  const cards = [
    {
      title: t('totalHt'),
      value: metrics?.total ?? 0,
      icon: RadioReceiver,
      gradient: 'from-blue-600 to-indigo-600 text-white',
      accentColor: 'border-l-blue-600',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      shadowColor: 'hover:shadow-blue-500/10'
    },
    {
      title: t('available'),
      value: metrics?.available ?? 0,
      icon: CheckCircle2,
      gradient: 'from-emerald-600 to-teal-600 text-white',
      accentColor: 'border-l-emerald-600',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      shadowColor: 'hover:shadow-emerald-500/10'
    },
    {
      title: t('borrowed'),
      value: metrics?.borrowed ?? 0,
      icon: History,
      gradient: 'from-amber-500 to-orange-500 text-white',
      accentColor: 'border-l-amber-500',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      shadowColor: 'hover:shadow-amber-500/10'
    },
    {
      title: t('broken'),
      value: metrics?.broken ?? 0,
      icon: Wrench,
      gradient: 'from-rose-600 to-red-600 text-white',
      accentColor: 'border-l-rose-600',
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
      shadowColor: 'hover:shadow-rose-500/10'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="border-outline-variant overflow-hidden rounded-2xl border shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card
            key={idx}
            className={`bg-card border-0 border-l-4 ${card.accentColor} overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.shadowColor}`}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-muted-foreground mb-1 text-sm font-medium tracking-tight">{card.title}</p>
                <p className="text-foreground text-3xl font-extrabold tracking-tight">{card.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}>
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
