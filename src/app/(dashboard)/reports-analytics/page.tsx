'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AnalyticsBento } from '@/features/dashboard/analytics-bento'
import { DashboardMetrics } from '@/features/dashboard/dashboard-metrics'
import { ExportActions } from '@/features/dashboard/export-actions'
import { RecentTransactions } from '@/features/dashboard/recent-transactions'
import { useDashboardData } from '@/hooks/use-dashboard'
import { AlertCircle, CalendarRange } from 'lucide-react'
import { useTranslations } from 'use-intl'

export default function DashboardPage(): React.JSX.Element {
  const t = useTranslations('dashboard')
  const { data, isLoading, isError, error } = useDashboardData()

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="font-display-lg text-on-surface text-3xl font-extrabold tracking-tight">{t('analytics.title')}</h3>
          <p className="font-body-lg text-muted-foreground mt-1 text-sm">{t('analytics.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-container-high text-on-surface font-label-md hover:bg-surface-variant border-outline-variant flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-colors">
            <CalendarRange className="size-4" />
            This Month
          </button>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="size-4" />
          <AlertDescription>{error instanceof Error ? error.message : 'Failed to load dashboard data.'}</AlertDescription>
        </Alert>
      )}

      {/* Metrics Summary Cards */}
      <DashboardMetrics metrics={data?.metrics} isLoading={isLoading} />

      {/* Bento Grid Analytics */}
      <AnalyticsBento
        monthlyTrends={data?.monthlyTrends}
        divisionDistribution={data?.divisionDistribution}
        brokenCount={data?.metrics.broken}
        totalCount={data?.metrics.total}
        isLoading={isLoading}
      />

      {/* Recent Transactions List */}
      <RecentTransactions transactions={data?.recentTransactions} isLoading={isLoading} />

      {/* Export Action Block */}
      <ExportActions />
    </div>
  )
}
