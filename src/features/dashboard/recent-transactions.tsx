'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { TransactionHistoryItem } from '@/types/transaction'
import { format } from 'date-fns'
import { ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'use-intl'

interface RecentTransactionsProps {
  transactions?: TransactionHistoryItem[]
  isLoading: boolean
}

export function RecentTransactions({ transactions = [], isLoading }: RecentTransactionsProps): React.JSX.Element {
  const t = useTranslations('dashboard')

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
        <CardHeader className="bg-surface-bright border-surface-variant border-b p-6">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
      <CardHeader className="bg-surface-bright border-surface-variant flex flex-row items-center justify-between border-b p-6">
        <CardTitle className="text-on-surface flex items-center gap-2 text-lg font-bold">
          <Info className="text-primary size-5" />
          {t('recentTransactions')}
        </CardTitle>
        <Link
          href="/riwayat-log"
          className="text-primary hover:bg-primary/10 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          View All
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="p-4 font-semibold">{t('table.htId')}</TableHead>
              <TableHead className="p-4 font-semibold">{t('table.borrower')}</TableHead>
              <TableHead className="p-4 font-semibold">{t('table.borrowTime')}</TableHead>
              <TableHead className="p-4 text-center font-semibold">{t('table.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((trx, idx) => {
              const isBorrowed = trx.status === 'BORROWED'
              return (
                <TableRow key={trx.id} className={`hover:bg-muted/30 transition-colors ${idx % 2 === 1 ? 'bg-muted/10' : ''}`}>
                  <TableCell className="text-primary p-4 font-mono text-sm font-semibold">{trx.htCode}</TableCell>
                  <TableCell className="p-4">
                    <p className="text-on-surface font-semibold">{trx.borrowerName}</p>
                    <p className="text-muted-foreground text-xs">{trx.department}</p>
                  </TableCell>
                  <TableCell className="p-4 text-sm">{format(new Date(trx.borrowTime), 'dd MMM yyyy, HH:mm')}</TableCell>
                  <TableCell className="p-4 text-center">
                    {isBorrowed ? (
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-full border-orange-200 bg-orange-100 px-2.5 py-0.5 font-semibold text-orange-800 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        {t('status.borrowed')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-full border-green-200 bg-green-100 px-2.5 py-0.5 font-semibold text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {t('status.completed')}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground p-8 text-center italic">
                  No recent transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
