'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DivisionDistribution, MonthlyTrendItem } from '@/types/report'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

interface DashboardChartsProps {
  monthlyTrends?: MonthlyTrendItem[]
  divisionDistribution?: DivisionDistribution[]
  isLoading: boolean
}

export function DashboardCharts({ monthlyTrends = [], divisionDistribution = [], isLoading }: DashboardChartsProps): React.JSX.Element {
  const t = useTranslations('dashboard')

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="bg-card border-outline-variant min-h-[280px] border p-6 shadow-sm lg:col-span-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
        </Card>
        <Card className="bg-card border-outline-variant min-h-[280px] border p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
        </Card>
      </div>
    )
  }

  // 1. Line Chart Coordinates for Monthly Trend
  const maxTrendVal = Math.max(...monthlyTrends.map((t) => t.count), 5)
  const padding = 12
  const width = 500
  const height = 150
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

  // 2. Division Distribution Donut Calculations
  const displayDistribution = divisionDistribution.slice(0, 3)
  const totalDistributionCount = divisionDistribution.reduce((acc, item) => acc + item.count, 0)
  const radius = 35
  const circumference = 2 * Math.PI * radius

  const donutSegments = []
  let accumulatedOffset = 0
  for (let idx = 0; idx < displayDistribution.length; idx++) {
    const item = displayDistribution[idx]
    const strokeDash = (item.count / (totalDistributionCount || 1)) * circumference
    const offset = accumulatedOffset
    accumulatedOffset += strokeDash

    let color = 'stroke-primary'
    if (idx === 1) color = 'stroke-blue-500'
    if (idx === 2) color = 'stroke-amber-500'

    donutSegments.push({
      ...item,
      strokeDash: `${strokeDash} ${circumference - strokeDash}`,
      strokeDashoffset: -offset,
      colorClass: color
    })
  }

  const legendColors = ['bg-primary', 'bg-blue-500', 'bg-amber-500', 'bg-slate-400']

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Monthly Loans Trend Line Chart (Spans 2 columns on large screens) */}
      <Card className="bg-card border-border group relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
        <div className="bg-primary absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h4 className="font-headline-sm text-foreground text-lg font-bold">{t('analytics.loansTitle')}</h4>
            <p className="font-body-md text-muted-foreground text-sm">{t('analytics.loansSubtitle')}</p>
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

        <div className="relative mt-4 flex min-h-[180px] flex-1 flex-col justify-end">
          <svg className="text-primary mt-auto w-full drop-shadow-sm" height={height} viewBox={`0 0 ${width} ${height}`} width="100%">
            <defs>
              <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaD && <path d={areaD} fill="url(#dashboardAreaGrad)" />}
            {pathD && <path d={pathD} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />}
            {points.map((point, idx) => (
              <circle
                key={idx}
                cx={point.x}
                cy={point.y}
                fill="currentColor"
                r="4"
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

      {/* Division Distribution Donut Chart (Spans 1 column) */}
      <Card className="bg-card border-border group relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl bg-amber-500" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h4 className="font-headline-sm text-foreground text-lg font-bold">{t('analytics.distributionTitle')}</h4>
            <p className="font-body-md text-muted-foreground text-sm">{t('analytics.distributionSubtitle')}</p>
          </div>
          <span className="text-muted-foreground rounded-full bg-slate-100 p-2 dark:bg-slate-800">
            <PieChart className="size-4" />
          </span>
        </div>

        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row lg:flex-col">
          {totalDistributionCount > 0 ? (
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="12" className="stroke-slate-100 dark:stroke-slate-800" />
                {donutSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    className={seg.colorClass}
                    strokeWidth="12"
                    strokeDasharray={seg.strokeDash}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-foreground text-xl font-extrabold">{totalDistributionCount}</span>
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">Active</span>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-dashed border-slate-200 p-2 text-center text-xs dark:border-slate-800">
              No active loans
            </div>
          )}

          <div className="w-full flex-1 space-y-2.5">
            {donutSegments.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-medium">
                <div className="flex min-w-0 items-center gap-2">
                  <div className={`h-3 w-3 shrink-0 rounded-full ${legendColors[idx]}`} />
                  <span className="font-body-md text-foreground truncate">{item.department}</span>
                </div>
                <span className="font-mono-data text-muted-foreground bg-muted ml-2 rounded px-2 py-0.5 font-semibold">{item.percentage}%</span>
              </div>
            ))}
            {donutSegments.length === 0 && (
              <div className="text-muted-foreground text-center text-xs italic">Active loans stats will display here.</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
