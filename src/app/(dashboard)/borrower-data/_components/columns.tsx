'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { BarcodeDisplay } from '@/components/shared/barcode-display'
import { Button } from '@/components/ui/button'

import type { Borrower } from '@/types/borrower'

interface UseBorrowerColumnsProps {
  onEdit: (borrower: Borrower) => void
  onDelete: (borrower: Borrower) => void
}

export function useBorrowerColumns({ onEdit, onDelete }: UseBorrowerColumnsProps): ColumnDef<Borrower>[] {
  const t = useTranslations('borrower')

  return useMemo(
    () => [
      {
        id: 'barcode',
        header: t('table.barcode'),
        cell: ({ row }) => {
          const borrower = row.original
          const barcodeValue = borrower.barcode || borrower.borrowerCode
          return (
            <BarcodeDisplay
              value={barcodeValue}
              fileName={`borrower-${borrower.borrowerCode}`}
              downloadLabel={t('barcode.download')}
              previewLabel={t('barcode.preview')}
            />
          )
        }
      },
      {
        accessorKey: 'borrowerCode',
        header: t('table.borrowerCode'),
        cell: ({ row }) => <span className="text-primary font-mono font-medium">{row.original.borrowerCode}</span>
      },
      {
        accessorKey: 'fullName',
        header: t('table.fullName')
      },
      {
        accessorKey: 'department',
        header: t('table.department')
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('table.actions')}</div>,
        cell: ({ row }) => {
          const borrower = row.original
          return (
            <div className="flex justify-end gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(borrower)}>
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">{t('action.edit')}</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => onDelete(borrower)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('action.delete')}</span>
              </Button>
            </div>
          )
        }
      }
    ],
    [t, onEdit, onDelete]
  )
}
