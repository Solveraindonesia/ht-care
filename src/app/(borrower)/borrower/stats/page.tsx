'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBorrowerDashboard } from '@/hooks/use-borrower-dashboard'
import { BarChart3, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function BorrowerStatsPage(): React.JSX.Element {
  const t = useTranslations('borrower.stats')
  const { data, isLoading } = useBorrowerDashboard()

  const monthlyTrends = data?.monthlyTrends ?? []

  if (isLoading) {
    return (
      <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Card className="bg-card border-border min-h-[350px] border p-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-[220px] w-full rounded-xl" />
          </div>
        </Card>
      </div>
    )
  }

  // Calculate coordinates for the line chart
  const maxTrendVal = Math.max(...monthlyTrends.map((t) => t.count), 5)
  const padding = 20
  const width = 600
  const height = 250
  const xStep = width / Math.max(monthlyTrends.length - 1, 1)

  const points = monthlyTrends.map((item, index) => {
    const x = index * xStep
    const y = height - padding - (item.count / maxTrendVal) * (height - 2 * padding)
    return { x, y }
  })

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M${point.x},${point.y}` : `${acc} L${point.x},${point.y}`
  }, '')

  const areaD = points.length > 0 ? `${pathD} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z` : ''

  // Calculate percentage change
  let percentageChange = 0
  let isPositive = true
  if (monthlyTrends.length >= 2) {
    const lastMonth = monthlyTrends[monthlyTrends.length - 2].count
    const currentMonth = monthlyTrends[monthlyTrends.length - 1].count
    if (lastMonth > 0) {
      percentageChange = Math.round(((currentMonth - lastMonth) / lastMonth) * 100)
    } else if (currentMonth > 0) {
      percentageChange = 100
    }
    isPositive = percentageChange >= 0
  }

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
      {/* Page Header */}
      <div>
        <h2 className="text-on-surface font-display-lg text-2xl font-extrabold tracking-tight sm:text-3xl">{t('title')}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
      </div>

      {/* SVG Line Chart Card */}
      <Card className="bg-card border-border group relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="bg-primary absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl" />
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h4 className="font-headline-sm text-foreground text-lg font-bold">{t('chartTitle')}</h4>
            <p className="font-body-md text-muted-foreground text-sm">Tren Bulanan</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
              {isPositive ? `+${percentageChange}%` : `${percentageChange}%`}
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="bg-primary/10 text-primary rounded-full p-2">
              <BarChart3 className="size-4" />
            </span>
          </div>
        </div>

        <div className="relative mt-4 flex min-h-[250px] flex-1 flex-col justify-end">
          <svg className="text-primary mt-auto w-full drop-shadow-sm" height={height} viewBox={`0 0 ${width} ${height}`} width="100%">
            <defs>
              <linearGradient id="borrowerAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaD && <path d={areaD} fill="url(#borrowerAreaGrad)" />}
            {pathD && <path d={pathD} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />}
            {points.map((point, idx) => (
              <circle
                key={idx}
                cx={point.x}
                cy={point.y}
                fill="currentColor"
                r="5"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              />
            ))}
          </svg>
          <div className="text-muted-foreground border-border mt-3 flex justify-between border-t pt-3 text-xs font-semibold">
            {monthlyTrends.map((t, idx) => (
              <span key={idx} className="group-hover:text-primary transition-colors">
                {t.month}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
