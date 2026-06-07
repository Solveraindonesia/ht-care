'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { useReportData } from '@/hooks/use-report'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DashboardActions } from './_components/dashboard-actions'
import { DashboardCharts } from './_components/dashboard-charts'
import { DashboardMetrics } from './_components/metrics'
import { RecentTransactions } from './_components/recent-transactions'

export default function DashboardPage(): React.JSX.Element {
  const t = useTranslations('dashboard')
  const { data, isLoading, isError, error } = useReportData()

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-8 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-on-surface font-display-lg text-2xl font-extrabold tracking-tight sm:text-3xl">{t('title')}</h2>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="size-4" />
          <AlertDescription>{error instanceof Error ? error.message : 'Failed to load dashboard data.'}</AlertDescription>
        </Alert>
      )}

      {/* Dynamic Summary Cards */}
      <DashboardMetrics metrics={data?.metrics} isLoading={isLoading} />

      {/* Quick Actions */}
      <DashboardActions />

      {/* Dynamic Charts */}
      <DashboardCharts monthlyTrends={data?.monthlyTrends} divisionDistribution={data?.divisionDistribution} isLoading={isLoading} />

      {/* Recent Transactions List */}
      <RecentTransactions transactions={data?.recentTransactions} isLoading={isLoading} />
    </div>
  )
}
