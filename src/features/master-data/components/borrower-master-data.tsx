'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Edit2, Loader2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBorrowers, useCreateBorrower, useDeleteBorrower, useUpdateBorrower } from '@/hooks/use-borrowers'
import { getBorrowerFormSchema } from '@/schemas/borrower.schema'

import { BarcodeDisplay } from './barcode-display'
import { ConfirmationDialog } from './confirmation-dialog'
import { MasterDataHeader } from './master-data-header'

import type { BorrowerFormData } from '@/schemas/borrower.schema'
import type { Borrower } from '@/types/borrower'
import type { SubmitHandler } from 'react-hook-form'

const DEFAULT_BORROWER_FORM_VALUES: BorrowerFormData = {
  borrowerCode: '',
  barcode: undefined,
  fullName: '',
  department: ''
}

interface BorrowerFormDialogProps {
  open: boolean
  borrower: Borrower | null
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BorrowerFormData) => Promise<void>
}

function getBorrowerFormDefaultValues(borrower: Borrower | null): BorrowerFormData {
  if (!borrower) {
    return DEFAULT_BORROWER_FORM_VALUES
  }

  return {
    borrowerCode: borrower.borrowerCode,
    barcode: borrower.barcode || undefined,
    fullName: borrower.fullName,
    department: borrower.department
  }
}

function BorrowerFormDialog({ open, borrower, isLoading, onOpenChange, onSubmit }: BorrowerFormDialogProps): React.JSX.Element {
  const t = useTranslations('borrower')
  const tValidation = useTranslations('borrower.validation')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const schema = getBorrowerFormSchema((key) => tValidation(key))

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<BorrowerFormData>({
    resolver: zodResolver(schema),
    defaultValues: getBorrowerFormDefaultValues(borrower)
  })

  const submitForm: SubmitHandler<BorrowerFormData> = async (data): Promise<void> => {
    setErrorMessage(null)

    try {
      await onSubmit(data)
    } catch {
      setErrorMessage(t('feedback.saveError'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{borrower ? t('dialog.edit.title') : t('dialog.create.title')}</DialogTitle>
          <DialogDescription>{borrower ? t('dialog.edit.description') : t('dialog.create.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <FieldGroup>
            <Field data-invalid={!!errors.borrowerCode}>
              <FieldLabel htmlFor="borrower-code">{t('field.borrowerCode')}</FieldLabel>
              <FieldContent>
                <Input id="borrower-code" disabled={isLoading} placeholder={t('field.borrowerCodePlaceholder')} {...register('borrowerCode')} />
              </FieldContent>
              <FieldError>{errors.borrowerCode?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.barcode}>
              <FieldLabel htmlFor="borrower-barcode">{t('field.barcode')}</FieldLabel>
              <FieldContent>
                <Input id="borrower-barcode" disabled={isLoading} placeholder={t('field.barcodePlaceholder')} {...register('barcode')} />
              </FieldContent>
              <FieldError>{errors.barcode?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.fullName}>
              <FieldLabel htmlFor="borrower-full-name">{t('field.fullName')}</FieldLabel>
              <FieldContent>
                <Input id="borrower-full-name" disabled={isLoading} placeholder={t('field.fullNamePlaceholder')} {...register('fullName')} />
              </FieldContent>
              <FieldError>{errors.fullName?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.department}>
              <FieldLabel htmlFor="borrower-department">{t('field.department')}</FieldLabel>
              <FieldContent>
                <Input id="borrower-department" disabled={isLoading} placeholder={t('field.departmentPlaceholder')} {...register('department')} />
              </FieldContent>
              <FieldError>{errors.department?.message}</FieldError>
            </Field>
          </FieldGroup>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>
              {t('action.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('action.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function BorrowerMasterData(): React.JSX.Element {
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

      <Card className="custom-shadow overflow-hidden border-0 p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead>{t('table.borrowerCode')}</TableHead>
                <TableHead>{t('table.fullName')}</TableHead>
                <TableHead>{t('table.department')}</TableHead>
                <TableHead>{t('table.barcode')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowersQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground h-32 text-center">
                    {t('feedback.loading')}
                  </TableCell>
                </TableRow>
              )}

              {!borrowersQuery.isLoading &&
                filteredBorrowers.map((borrower) => {
                  const barcodeValue = borrower.barcode || borrower.borrowerCode

                  return (
                    <TableRow key={borrower.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-primary font-mono font-medium">{borrower.borrowerCode}</TableCell>
                      <TableCell>{borrower.fullName}</TableCell>
                      <TableCell>{borrower.department}</TableCell>
                      <TableCell>
                        <BarcodeDisplay
                          value={barcodeValue}
                          fileName={`borrower-${borrower.borrowerCode}`}
                          downloadLabel={t('barcode.download')}
                          previewLabel={t('barcode.preview')}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(borrower)}>
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">{t('action.edit')}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8"
                            onClick={() => setDeleteTarget(borrower)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('action.delete')}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}

              {!borrowersQuery.isLoading && filteredBorrowers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground h-32 text-center">
                    {t('feedback.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {isFormOpen && (
        <BorrowerFormDialog
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
