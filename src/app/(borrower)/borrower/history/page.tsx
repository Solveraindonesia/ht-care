'use client'

import { DataTable } from '@/components/shared/data-table'
import { MasterDataHeader } from '@/components/shared/master-data-header'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useTransactionHistory } from '@/hooks/use-transactions'
import type { TransactionHistoryItem } from '@/types/transaction'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

export default function BorrowerHistoryPage(): React.JSX.Element {
  const t = useTranslations('borrower.history')
  const tCommon = useTranslations('common')
  const [searchValue, setSearchValue] = useState('')

  const { data = [], isLoading, isError, error } = useTransactionHistory()

  const filteredHistory = useMemo((): TransactionHistoryItem[] => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return data
    }

    return data.filter((item) => {
      return [item.htCode, item.brandType].join(' ').toLowerCase().includes(normalizedSearch)
    })
  }, [data, searchValue])

  const columns = useMemo(
    (): ColumnDef<TransactionHistoryItem>[] => [
      {
        accessorKey: 'htCode',
        header: 'HT ID',
        cell: ({ row }) => <span className="text-primary font-mono font-bold dark:text-blue-400">{row.original.htCode}</span>
      },
      {
        accessorKey: 'brandType',
        header: 'Brand / Type'
      },
      {
        accessorKey: 'borrowTime',
        header: 'Waktu Pinjam',
        cell: ({ row }) => format(new Date(row.original.borrowTime), 'dd MMM yyyy, HH:mm')
      },
      {
        accessorKey: 'returnTime',
        header: 'Waktu Kembali',
        cell: ({ row }) => (row.original.returnTime ? format(new Date(row.original.returnTime), 'dd MMM yyyy, HH:mm') : '-')
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const isBorrowed = row.original.status === 'BORROWED'
          return isBorrowed ? (
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
          )
        }
      }
    ],
    []
  )

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
      <MasterDataHeader
        title={t('title')}
        description={t('subtitle')}
        searchLabel="Cari riwayat pinjam"
        searchPlaceholder="Cari berdasarkan kode HT atau brand..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {isError && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="size-4" />
          <AlertDescription>{error instanceof Error ? error.message : 'Failed to load transaction history.'}</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredHistory}
        isLoading={isLoading}
        loadingMessage={tCommon('loading')}
        emptyMessage="Tidak ada riwayat peminjaman ditemukan."
      />
    </div>
  )
}
