'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DivisionDistribution, MonthlyTrendItem } from '@/types/dashboard'
import { BarChart, PieChart, TrendingUp } from 'lucide-react'
import { useTranslations } from 'use-intl'

interface AnalyticsBentoProps {
  monthlyTrends?: MonthlyTrendItem[]
  divisionDistribution?: DivisionDistribution[]
  brokenCount?: number
  totalCount?: number
  isLoading: boolean
}

export function AnalyticsBento({
  monthlyTrends = [],
  divisionDistribution = [],
  brokenCount = 0,
  totalCount = 0,
  isLoading
}: AnalyticsBentoProps): React.JSX.Element {
  const t = useTranslations('dashboard')

  // Loading state skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="bg-card min-h-[280px] border-0 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-[160px] w-full rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Calculate monthly percentage change
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

  // 1. Line Chart coordinates calculation for SVG
  const maxTrendVal = Math.max(...monthlyTrends.map((t) => t.count), 5)
  const padding = 10
  const width = 300
  const height = 90
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

  // 2. Division Distribution Donut calculations
  // Limit to top 3 and calculate others if needed
  const displayDistribution = divisionDistribution.slice(0, 3)
  const totalDistributionCount = divisionDistribution.reduce((acc, item) => acc + item.count, 0)

  // Calculate stroke-dasharray offsets for Donut chart
  const radius = 35
  const circumference = 2 * Math.PI * radius

  // Use standard for loop to avoid mutating variables inside callbacks (React compiler restriction)
  const donutSegments = []
  let accumulatedOffset = 0
  for (let idx = 0; idx < displayDistribution.length; idx++) {
    const item = displayDistribution[idx]
    const strokeDash = (item.count / (totalDistributionCount || 1)) * circumference
    const offset = accumulatedOffset
    accumulatedOffset += strokeDash

    let color = 'stroke-primary'
    if (idx === 1) color = 'stroke-[#2563eb]' // light blue / secondary container
    if (idx === 2) color = 'stroke-amber-500' // yellow/amber

    donutSegments.push({
      ...item,
      strokeDash: `${strokeDash} ${circumference - strokeDash}`,
      strokeDashoffset: -offset,
      colorClass: color
    })
  }

  // Colors mapping for legend
  const legendColors = ['bg-primary', 'bg-[#2563eb]', 'bg-amber-500', 'bg-slate-400']

  // 3. Status Kondisi (Bar Chart)
  const goodCount = totalCount - brokenCount
  const maxConditionVal = Math.max(goodCount, brokenCount, 1)

  const barHeightGood = (goodCount / maxConditionVal) * 100
  const barHeightBroken = (brokenCount / maxConditionVal) * 100
  // Standard "Others" status
  const barHeightOthers = ((totalCount - goodCount - brokenCount) / maxConditionVal) * 100

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Line Chart Card */}
      <div className="bg-surface-container-lowest border-surface-variant group relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="bg-primary absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl"></div>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h4 className="font-headline-sm text-on-surface text-lg font-bold">{t('analytics.loansTitle')}</h4>
            <p className="font-body-md text-on-surface-variant text-sm">{t('analytics.loansSubtitle')}</p>
          </div>
          <span className="material-symbols-outlined text-primary bg-primary-fixed rounded-full p-2">
            <TrendingUp className="size-5" />
          </span>
        </div>
        <div className="relative flex min-h-[160px] flex-1 flex-col justify-end">
          <div className="font-headline-md text-primary absolute top-0 right-0 text-2xl font-bold">
            {isPositive ? `+${percentageChange}%` : `${percentageChange}%`}
          </div>
          <svg className="text-primary mt-auto w-full drop-shadow-sm" height={height} viewBox={`0 0 ${width} ${height}`} width="100%">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaD && <path d={areaD} fill="url(#areaGrad)" />}
            {pathD && <path d={pathD} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />}
            {points.map((point, idx) => (
              <circle
                key={idx}
                cx={point.x}
                cy={point.y}
                fill="currentColor"
                r="3"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              />
            ))}
          </svg>
          <div className="text-on-surface-variant border-outline-variant mt-2 flex justify-between border-t pt-2 text-xs">
            {monthlyTrends.map((t, idx) => (
              <span key={idx}>{t.month.split(' ')[0]}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Pie/Donut Chart Card */}
      <div className="bg-surface-container-lowest border-surface-variant group relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="bg-tertiary-container absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl"></div>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h4 className="font-headline-sm text-on-surface text-lg font-bold">{t('analytics.distributionTitle')}</h4>
            <p className="font-body-md text-on-surface-variant text-sm">{t('analytics.distributionSubtitle')}</p>
          </div>
          <span className="material-symbols-outlined text-tertiary-container bg-surface-variant rounded-full p-2">
            <PieChart className="text-on-surface-variant size-5" />
          </span>
        </div>
        <div className="flex min-h-[160px] flex-1 items-center justify-center gap-6">
          {totalDistributionCount > 0 ? (
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--color-slate-100)" strokeWidth="12" />
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
                <span className="text-on-surface text-xl font-extrabold">{totalDistributionCount}</span>
                <span className="text-muted-foreground text-[10px] tracking-wider uppercase">Active</span>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-dashed border-slate-200 p-2 text-center text-xs">
              No active loans
            </div>
          )}
          <div className="flex-1 space-y-2">
            {donutSegments.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex min-w-0 items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${legendColors[idx]}`} />
                  <span className="font-body-md text-on-surface truncate">{item.department}</span>
                </div>
                <span className="font-mono-data text-on-surface-variant ml-2 font-semibold">{item.percentage}%</span>
              </div>
            ))}
            {donutSegments.length === 0 && <div className="text-muted-foreground text-xs italic">Active loans stats will display here.</div>}
          </div>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-surface-container-lowest border-surface-variant group relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="bg-secondary absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl"></div>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h4 className="font-headline-sm text-on-surface text-lg font-bold">{t('analytics.conditionTitle')}</h4>
            <p className="font-body-md text-on-surface-variant text-sm">{t('analytics.conditionSubtitle')}</p>
          </div>
          <span className="material-symbols-outlined text-secondary bg-secondary-fixed rounded-full p-2">
            <BarChart className="text-on-surface-variant size-5" />
          </span>
        </div>
        <div className="flex min-h-[160px] flex-1 flex-col justify-end gap-2 pb-2">
          <div className="w-full space-y-2">
            <div className="flex h-24 items-end justify-around gap-4">
              {/* Baik Bar */}
              <div
                className="group relative w-10 cursor-pointer rounded-t-lg bg-green-500 transition-all hover:bg-green-600"
                style={{ height: `${Math.max(barHeightGood, 5)}%` }}
              >
                <div className="font-label-md absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                  {goodCount}
                </div>
              </div>
              {/* Rusak Bar */}
              <div
                className="group relative w-10 cursor-pointer rounded-t-lg bg-red-500 transition-all hover:bg-red-600"
                style={{ height: `${Math.max(barHeightBroken, 5)}%` }}
              >
                <div className="font-label-md absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                  {brokenCount}
                </div>
              </div>
              {/* Lainnya Bar */}
              <div
                className="group relative w-10 cursor-pointer rounded-t-lg bg-amber-500 transition-all hover:bg-amber-600"
                style={{ height: `${Math.max(barHeightOthers, 5)}%` }}
              >
                <div className="font-label-md absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                  {totalCount - goodCount - brokenCount}
                </div>
              </div>
            </div>
            <div className="border-outline-variant flex justify-around border-t pt-2">
              <span className="font-label-md text-on-surface-variant w-16 text-center text-xs font-semibold">Baik</span>
              <span className="font-label-md text-on-surface-variant w-16 text-center text-xs font-semibold">Rusak</span>
              <span className="font-label-md text-on-surface-variant w-16 text-center text-xs font-semibold">Lainnya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
