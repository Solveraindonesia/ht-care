'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Edit2, Loader2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCreateHtItem, useDeleteHtItem, useHtItems, useUpdateHtItem } from '@/hooks/use-ht-items'
import { getHtFormSchema } from '@/schemas/ht.schema'

import { BarcodeDisplay } from '@/components/shared/barcode-display'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { MasterDataHeader } from '@/components/shared/master-data-header'
import { HtConditionBadge, HtStatusBadge } from '@/components/shared/status-badge'

import type { HtFormData } from '@/schemas/ht.schema'
import type { HtItem } from '@/types/ht'
import type { SubmitHandler } from 'react-hook-form'

const DEFAULT_HT_FORM_VALUES: HtFormData = {
  htCode: '',
  barcode: undefined,
  brandType: '',
  condition: 'GOOD',
  status: 'AVAILABLE'
}

interface HtFormDialogProps {
  open: boolean
  item: HtItem | null
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: HtFormData) => Promise<void>
}

function getHtFormDefaultValues(item: HtItem | null): HtFormData {
  if (!item) {
    return DEFAULT_HT_FORM_VALUES
  }

  return {
    htCode: item.htCode,
    barcode: item.barcode || undefined,
    brandType: item.brandType,
    condition: item.condition,
    status: item.status
  }
}

function HtFormDialog({ open, item, isLoading, onOpenChange, onSubmit }: HtFormDialogProps): React.JSX.Element {
  const t = useTranslations('ht')
  const tValidation = useTranslations('ht.validation')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const schema = getHtFormSchema((key) => tValidation(key))

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<HtFormData>({
    resolver: zodResolver(schema),
    defaultValues: getHtFormDefaultValues(item)
  })

  const submitForm: SubmitHandler<HtFormData> = async (data): Promise<void> => {
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
          <DialogTitle>{item ? t('dialog.edit.title') : t('dialog.create.title')}</DialogTitle>
          <DialogDescription>{item ? t('dialog.edit.description') : t('dialog.create.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <FieldGroup>
            <Field data-invalid={!!errors.htCode}>
              <FieldLabel htmlFor="ht-code">{t('field.htCode')}</FieldLabel>
              <FieldContent>
                <Input id="ht-code" disabled={isLoading} placeholder={t('field.htCodePlaceholder')} {...register('htCode')} />
              </FieldContent>
              <FieldError>{errors.htCode?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.barcode}>
              <FieldLabel htmlFor="ht-barcode">{t('field.barcode')}</FieldLabel>
              <FieldContent>
                <Input id="ht-barcode" disabled={isLoading} placeholder={t('field.barcodePlaceholder')} {...register('barcode')} />
              </FieldContent>
              <FieldError>{errors.barcode?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.brandType}>
              <FieldLabel htmlFor="ht-brand-type">{t('field.brandType')}</FieldLabel>
              <FieldContent>
                <Input id="ht-brand-type" disabled={isLoading} placeholder={t('field.brandTypePlaceholder')} {...register('brandType')} />
              </FieldContent>
              <FieldError>{errors.brandType?.message}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.condition}>
                <FieldLabel>{t('field.condition')}</FieldLabel>
                <Controller
                  control={control}
                  name="condition"
                  render={({ field }): React.JSX.Element => (
                    <Select value={field.value} disabled={isLoading} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GOOD">{t('condition.good')}</SelectItem>
                        <SelectItem value="BROKEN">{t('condition.broken')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.condition?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.status}>
                <FieldLabel>{t('field.status')}</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }): React.JSX.Element => (
                    <Select value={field.value} disabled={isLoading} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">{t('status.available')}</SelectItem>
                        <SelectItem value="BORROWED">{t('status.borrowed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.status?.message}</FieldError>
              </Field>
            </div>
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

export function HtMasterData(): React.JSX.Element {
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
        t(`condition.${item.condition === 'GOOD' ? 'good' : 'broken'}`),
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

      <Card className="custom-shadow overflow-hidden border-0 p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead>{t('table.htCode')}</TableHead>
                <TableHead>{t('table.brandType')}</TableHead>
                <TableHead>{t('table.barcode')}</TableHead>
                <TableHead>{t('table.condition')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {htItemsQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground h-32 text-center">
                    {t('feedback.loading')}
                  </TableCell>
                </TableRow>
              )}

              {!htItemsQuery.isLoading &&
                filteredItems.map((item) => {
                  const barcodeValue = item.barcode || item.htCode

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-primary font-mono font-medium">{item.htCode}</TableCell>
                      <TableCell>{item.brandType}</TableCell>
                      <TableCell>
                        <BarcodeDisplay
                          value={barcodeValue}
                          fileName={`ht-${item.htCode}`}
                          downloadLabel={t('barcode.download')}
                          previewLabel={t('barcode.preview')}
                        />
                      </TableCell>
                      <TableCell>
                        <HtConditionBadge
                          condition={item.condition}
                          label={item.condition === 'GOOD' ? t('condition.good') : t('condition.broken')}
                        />
                      </TableCell>
                      <TableCell>
                        <HtStatusBadge status={item.status} label={item.status === 'AVAILABLE' ? t('status.available') : t('status.borrowed')} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(item)}>
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">{t('action.edit')}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('action.delete')}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}

              {!htItemsQuery.isLoading && filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground h-32 text-center">
                    {t('feedback.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {isFormOpen && (
        <HtFormDialog
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
