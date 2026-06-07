'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBorrowerDashboard } from '@/hooks/use-borrower-dashboard'
import { format } from 'date-fns'
import { AlertCircle, ArrowRight, CheckCircle2, History, RadioReceiver } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import * as React from 'react'

export default function BorrowerDashboardPage(): React.JSX.Element {
  const { data: session } = useSession()
  const t = useTranslations('borrower.dashboard')
  const tCommon = useTranslations('common')
  const { data, isLoading, isError, error } = useBorrowerDashboard()

  const metrics = data?.metrics
  const recentTransactions = data?.recentTransactions ?? []

  const cards = [
    {
      title: t('totalBorrowed'),
      value: metrics?.totalBorrowed ?? 0,
      icon: RadioReceiver,
      accentColor: 'border-l-blue-600',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      shadowColor: 'hover:shadow-blue-500/10'
    },
    {
      title: t('currentlyActive'),
      value: metrics?.currentlyActive ?? 0,
      icon: History,
      accentColor: 'border-l-amber-500',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      shadowColor: 'hover:shadow-amber-500/10'
    },
    {
      title: t('returnedCount'),
      value: metrics?.returnedCount ?? 0,
      icon: CheckCircle2,
      accentColor: 'border-l-emerald-600',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      shadowColor: 'hover:shadow-emerald-500/10'
    }
  ]

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-8 duration-500">
      {/* Header Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white shadow-lg dark:border dark:border-white/10 dark:from-slate-900 dark:to-slate-800">
        <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10">
          <RadioReceiver className="h-64 w-64" />
        </div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('welcome', { name: session?.user?.name ?? 'Borrower' })}</h2>
          <p className="max-w-xl text-base text-blue-100 dark:text-slate-300">{t('welcomeSubtitle')}</p>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="size-4" />
          <AlertDescription>{error instanceof Error ? error.message : 'Failed to load dashboard data.'}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="border-border overflow-hidden rounded-2xl border shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </CardContent>
              </Card>
            ))
          : cards.map((card, idx) => {
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

      {/* Recent Transactions List */}
      <Card className="border-border overflow-hidden rounded-2xl border shadow-sm">
        <CardHeader className="bg-muted/30 border-border flex flex-row items-center justify-between border-b p-6">
          <CardTitle className="text-foreground flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <History className="text-primary size-5" />
            {t('recentTransactions')}
          </CardTitle>
          <Link
            href="/borrower/history"
            className="text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:translate-x-0.5"
          >
            {tCommon('viewAll')}
            <ArrowRight className="size-3.5" />
          </Link>
        </CardHeader>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-card">
                <TableRow className="border-border border-b hover:bg-transparent">
                  <TableHead className="p-4 text-xs font-semibold tracking-wider uppercase">HT ID</TableHead>
                  <TableHead className="p-4 text-xs font-semibold tracking-wider uppercase">Brand / Type</TableHead>
                  <TableHead className="p-4 text-xs font-semibold tracking-wider uppercase">Waktu Pinjam</TableHead>
                  <TableHead className="p-4 text-xs font-semibold tracking-wider uppercase">Waktu Kembali</TableHead>
                  <TableHead className="p-4 text-center text-xs font-semibold tracking-wider uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((trx, idx) => {
                  const isBorrowed = trx.status === 'BORROWED'
                  return (
                    <TableRow
                      key={trx.id}
                      className={`hover:bg-muted/30 border-border border-b transition-colors ${idx % 2 === 1 ? 'bg-muted/5' : ''}`}
                    >
                      <TableCell className="text-primary p-4 font-mono text-sm font-semibold tracking-tight dark:text-blue-400">
                        {trx.htCode}
                      </TableCell>
                      <TableCell className="text-foreground p-4 font-medium">{trx.brandType}</TableCell>
                      <TableCell className="text-muted-foreground p-4 text-sm">{format(new Date(trx.borrowTime), 'dd MMM yyyy, HH:mm')}</TableCell>
                      <TableCell className="text-muted-foreground p-4 text-sm">
                        {trx.returnTime ? format(new Date(trx.returnTime), 'dd MMM yyyy, HH:mm') : '-'}
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        {isBorrowed ? (
                          <Badge
                            variant="outline"
                            className="gap-1 rounded-full border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                          >
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1 rounded-full border-green-200 bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Returned
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {recentTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground p-8 text-center text-sm italic">
                      {t('noTransactions')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  )
}
