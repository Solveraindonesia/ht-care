'use client'

import { DataTable } from '@/components/shared/data-table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useTransactionHistory } from '@/hooks/use-transactions'
import type { TransactionHistoryItem } from '@/types/transaction'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { AlertCircle, History, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'use-intl'

export default function RiwayatLogPage(): React.JSX.Element {
  const t = useTranslations('transaction')
  const [searchValue, setSearchValue] = useState('')

  const historyQuery = useTransactionHistory()

  const filteredHistory = useMemo((): TransactionHistoryItem[] => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const data = historyQuery.data ?? []

    if (!normalizedSearch) {
      return data
    }

    return data.filter((item) => {
      const isStatusMatch =
        item.status === 'BORROWED'
          ? t('history.status.borrowed').toLowerCase().includes(normalizedSearch)
          : t('history.status.returned').toLowerCase().includes(normalizedSearch)

      return [item.id, item.htCode, item.brandType, item.borrowerName, item.borrowerCode, item.department, isStatusMatch ? 'status_match' : '']
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
  }, [historyQuery.data, searchValue, t])

  const columns = useMemo(
    (): ColumnDef<TransactionHistoryItem>[] => [
      {
        accessorKey: 'id',
        header: t('history.table.transactionId'),
        cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">{row.original.id}</span>
      },
      {
        accessorKey: 'htCode',
        header: t('history.table.htCode'),
        cell: ({ row }) => (
          <div>
            <p className="text-primary font-mono text-sm font-semibold">{row.original.htCode}</p>
            <p className="text-muted-foreground text-xs">{row.original.brandType}</p>
          </div>
        )
      },
      {
        accessorKey: 'borrowerName',
        header: t('history.table.borrower'),
        cell: ({ row }) => (
          <div>
            <p className="text-on-surface font-semibold">{row.original.borrowerName}</p>
            <p className="text-muted-foreground text-xs">
              {row.original.borrowerCode} — {row.original.department}
            </p>
          </div>
        )
      },
      {
        accessorKey: 'borrowTime',
        header: t('history.table.borrowTime'),
        cell: ({ row }) => <span className="text-sm">{format(new Date(row.original.borrowTime), 'dd MMM yyyy, HH:mm')}</span>
      },
      {
        accessorKey: 'returnTime',
        header: t('history.table.returnTime'),
        cell: ({ row }) => {
          const val = row.original.returnTime
          return <span className="text-sm">{val ? format(new Date(val), 'dd MMM yyyy, HH:mm') : '—'}</span>
        }
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center">{t('history.table.status')}</div>,
        cell: ({ row }) => {
          const isBorrowed = row.original.status === 'BORROWED'
          return (
            <div className="flex justify-center">
              {isBorrowed ? (
                <Badge
                  variant="outline"
                  className="gap-1 rounded-full border-orange-200 bg-orange-100 px-2.5 py-0.5 font-semibold text-orange-800 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  {t('history.status.borrowed')}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 rounded-full border-green-200 bg-green-100 px-2.5 py-0.5 font-semibold text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {t('history.status.returned')}
                </Badge>
              )}
            </div>
          )
        }
      }
    ],
    [t]
  )

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary dark:bg-primary/20 flex size-12 items-center justify-center rounded-2xl">
            <History className="size-6" />
          </div>
          <div>
            <h3 className="font-display-lg text-on-surface text-2xl font-extrabold tracking-tight">{t('history.title')}</h3>
            <p className="font-body-lg text-muted-foreground text-sm">{t('history.description')}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-10 w-full rounded-xl pl-9"
            placeholder="Cari transaksi..."
          />
        </div>
      </div>

      {/* Error state */}
      {historyQuery.isError && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="size-4" />
          <AlertDescription>{t('history.feedback.loadError')}</AlertDescription>
        </Alert>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredHistory}
        isLoading={historyQuery.isLoading}
        loadingMessage={t('history.feedback.loading')}
        emptyMessage={t('history.feedback.empty')}
      />
    </div>
  )
}
