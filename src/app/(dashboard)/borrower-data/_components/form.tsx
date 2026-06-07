'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { getBorrowerFormSchema } from '@/schemas/borrower.schema'

import type { BorrowerFormData } from '@/schemas/borrower.schema'
import type { Borrower } from '@/types/borrower'
import type { SubmitHandler } from 'react-hook-form'

const DEFAULT_BORROWER_FORM_VALUES: BorrowerFormData = {
  borrowerCode: '',
  barcode: undefined,
  fullName: '',
  department: ''
}

export interface BorrowerFormProps {
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

export function BorrowerForm({ open, borrower, isLoading, onOpenChange, onSubmit }: BorrowerFormProps): React.JSX.Element {
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
