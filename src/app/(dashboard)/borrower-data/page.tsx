'use client'

import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { DataTable } from '@/components/shared/data-table'
import { MasterDataHeader } from '@/components/shared/master-data-header'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useBorrowers, useCreateBorrower, useDeleteBorrower, useUpdateBorrower } from '@/hooks/use-borrowers'
import type { BorrowerFormData } from '@/schemas/borrower.schema'
import type { Borrower } from '@/types/borrower'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useBorrowerColumns } from './_components/columns'
import { BorrowerForm } from './_components/form'

export default function DataPeminjamPage(): React.JSX.Element {
  const t = useTranslations('borrower')
  const [searchValue, setSearchValue] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Borrower | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  const borrowersQuery = useBorrowers()
  const createMutation = useCreateBorrower()
  const updateMutation = useUpdateBorrower()
  const deleteMutation = useDeleteBorrower()

  const filteredBorrowers = useMemo((): Borrower[] => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return borrowersQuery.data ?? []
    }

    return (borrowersQuery.data ?? []).filter((borrower) => {
      const barcode = borrower.barcode || borrower.borrowerCode

      return [borrower.borrowerCode, barcode, borrower.fullName, borrower.department].join(' ').toLowerCase().includes(normalizedSearch)
    })
  }, [borrowersQuery.data, searchValue])

  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  const openCreateDialog = (): void => {
    setSelectedBorrower(null)
    setPageError(null)
    setIsFormOpen(true)
  }

  const openEditDialog = (borrower: Borrower): void => {
    setSelectedBorrower(borrower)
    setPageError(null)
    setIsFormOpen(true)
  }

  const handleOpenFormChange = (open: boolean): void => {
    setIsFormOpen(open)

    if (!open) {
      setSelectedBorrower(null)
    }
  }

  const handleSubmit = async (data: BorrowerFormData): Promise<void> => {
    if (selectedBorrower) {
      await updateMutation.mutateAsync({
        id: selectedBorrower.id,
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

  const columns = useBorrowerColumns({
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

      {(pageError || borrowersQuery.isError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{pageError || t('feedback.loadError')}</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredBorrowers}
        isLoading={borrowersQuery.isLoading}
        loadingMessage={t('feedback.loading')}
        emptyMessage={t('feedback.empty')}
      />

      {isFormOpen && (
        <BorrowerForm
          key={selectedBorrower?.id || 'create'}
          open={isFormOpen}
          borrower={selectedBorrower}
          isLoading={isSaving}
          onOpenChange={handleOpenFormChange}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmationDialog
        open={deleteTarget !== null}
        title={t('dialog.delete.title')}
        description={t('dialog.delete.description', { code: deleteTarget?.borrowerCode ?? '' })}
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
