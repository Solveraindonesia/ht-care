'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getHtFormSchema } from '@/schemas/ht.schema'

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

export interface HtFormProps {
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

export function HtForm({ open, item, isLoading, onOpenChange, onSubmit }: HtFormProps): React.JSX.Element {
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
