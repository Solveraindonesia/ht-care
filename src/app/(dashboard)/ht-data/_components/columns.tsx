'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { BarcodeDisplay } from '@/components/shared/barcode-display'
import { HtConditionBadge, HtStatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'

import type { HtItem } from '@/types/ht'

interface UseHtColumnsProps {
  onEdit: (item: HtItem) => void
  onDelete: (item: HtItem) => void
}

export function useHtColumns({ onEdit, onDelete }: UseHtColumnsProps): ColumnDef<HtItem>[] {
  const t = useTranslations('ht')

  return useMemo(
    () => [
      {
        id: 'barcode',
        header: t('table.barcode'),
        cell: ({ row }) => {
          const item = row.original
          const barcodeValue = item.barcode || item.htCode
          return (
            <BarcodeDisplay
              value={barcodeValue}
              fileName={`ht-${item.htCode}`}
              downloadLabel={t('barcode.download')}
              previewLabel={t('barcode.preview')}
            />
          )
        }
      },
      {
        accessorKey: 'htCode',
        header: t('table.htCode'),
        cell: ({ row }) => <span className="text-primary font-mono font-medium">{row.original.htCode}</span>
      },
      {
        accessorKey: 'brandType',
        header: t('table.brandType')
      },
      {
        accessorKey: 'condition',
        header: t('table.condition'),
        cell: ({ row }) => {
          const item = row.original
          return <HtConditionBadge condition={item.condition} label={t(`condition.${item.condition.toLowerCase()}`)} />
        }
      },
      {
        accessorKey: 'status',
        header: t('table.status'),
        cell: ({ row }) => {
          const item = row.original
          return <HtStatusBadge status={item.status} label={item.status === 'AVAILABLE' ? t('status.available') : t('status.borrowed')} />
        }
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('table.actions')}</div>,
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex justify-end gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">{t('action.edit')}</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => onDelete(item)}>
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
