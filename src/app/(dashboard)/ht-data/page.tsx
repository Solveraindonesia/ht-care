'use client'

import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { DataTable } from '@/components/shared/data-table'
import { MasterDataHeader } from '@/components/shared/master-data-header'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCreateHtItem, useDeleteHtItem, useHtItems, useUpdateHtItem } from '@/hooks/use-ht-items'
import type { HtFormData } from '@/schemas/ht.schema'
import type { HtItem } from '@/types/ht'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useHtColumns } from './_components/columns'
import { HtForm } from './_components/form'

export default function DataHtPage(): React.JSX.Element {
  const t = useTranslations('ht')
  const [searchValue, setSearchValue] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<HtItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<HtItem | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  const htItemsQuery = useHtItems()
  const createMutation = useCreateHtItem()
  const updateMutation = useUpdateHtItem()
  const deleteMutation = useDeleteHtItem()

  const filteredItems = useMemo((): HtItem[] => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return htItemsQuery.data ?? []
    }

    return (htItemsQuery.data ?? []).filter((item) => {
      const barcode = item.barcode || item.htCode

      return [
        item.htCode,
        barcode,
        item.brandType,
        t(`condition.${item.condition.toLowerCase()}`),
        t(`status.${item.status === 'AVAILABLE' ? 'available' : 'borrowed'}`)
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
  }, [htItemsQuery.data, searchValue, t])

  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  const openCreateDialog = (): void => {
    setSelectedItem(null)
    setPageError(null)
    setIsFormOpen(true)
  }

  const openEditDialog = (item: HtItem): void => {
    setSelectedItem(item)
    setPageError(null)
    setIsFormOpen(true)
  }

  const handleOpenFormChange = (open: boolean): void => {
    setIsFormOpen(open)

    if (!open) {
      setSelectedItem(null)
    }
  }

  const handleSubmit = async (data: HtFormData): Promise<void> => {
    if (selectedItem) {
      await updateMutation.mutateAsync({
        id: selectedItem.id,
        ...data
      })
    } else {
      await createMutation.mutateAsync(data)
    }

    handleOpenFormChange(false)
  }

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) {
      return
    }

    setPageError(null)

    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      setPageError(t('feedback.deleteError'))
    }
  }

  const columns = useHtColumns({
    onEdit: openEditDialog,
    onDelete: setDeleteTarget
  })

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
      <MasterDataHeader
        title={t('title')}
        description={t('description')}
        searchLabel={t('search.label')}
        searchPlaceholder={t('search.placeholder')}
        addLabel={t('action.add')}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onAdd={openCreateDialog}
      />

      {(pageError || htItemsQuery.isError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{pageError || t('feedback.loadError')}</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredItems}
        isLoading={htItemsQuery.isLoading}
        loadingMessage={t('feedback.loading')}
        emptyMessage={t('feedback.empty')}
      />

      {isFormOpen && (
        <HtForm
          key={selectedItem?.id || 'create'}
          open={isFormOpen}
          item={selectedItem}
          isLoading={isSaving}
          onOpenChange={handleOpenFormChange}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmationDialog
        open={deleteTarget !== null}
        title={t('dialog.delete.title')}
        description={t('dialog.delete.description', { code: deleteTarget?.htCode ?? '' })}
        cancelLabel={t('action.cancel')}
        confirmLabel={t('action.confirmDelete')}
        isLoading={isDeleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
