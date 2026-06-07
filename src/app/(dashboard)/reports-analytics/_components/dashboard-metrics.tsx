'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardMetrics as MetricsType } from '@/types/dashboard'
import { CheckCircle2, History, RadioReceiver, Wrench } from 'lucide-react'
import { useTranslations } from 'use-intl'

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
      colorClass: 'border-l-primary',
      iconBg: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
    },
    {
      title: t('available'),
      value: metrics?.available ?? 0,
      icon: CheckCircle2,
      colorClass: 'border-l-green-500',
      iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      title: t('borrowed'),
      value: metrics?.borrowed ?? 0,
      icon: History,
      colorClass: 'border-l-orange-500',
      iconBg: 'bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400'
    },
    {
      title: t('broken'),
      value: metrics?.broken ?? 0,
      icon: Wrench,
      colorClass: 'border-l-destructive',
      iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="overflow-hidden border-0 shadow-sm">
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
            className={`bg-card border-0 border-l-4 ${card.colorClass} overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md`}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-muted-foreground mb-1 text-sm font-medium">{card.title}</p>
                <p className="text-foreground text-3xl font-bold">{card.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
