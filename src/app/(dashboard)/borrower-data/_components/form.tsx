'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormDialog } from '@/components/shared/form-dialog'
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
  department: '',
  email: '',
  password: ''
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
    department: borrower.department,
    email: borrower.email,
    password: ''
  }
}

export function BorrowerForm({ open, borrower, isLoading, onOpenChange, onSubmit }: BorrowerFormProps): React.JSX.Element {
  const t = useTranslations('borrower')
  const tValidation = useTranslations('borrower.validation')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const schema = getBorrowerFormSchema((key) => tValidation(key), !!borrower)

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
    <FormDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={borrower ? t('dialog.edit.title') : t('dialog.create.title')}
      description={borrower ? t('dialog.edit.description') : t('dialog.create.description')}
      onSubmit={handleSubmit(submitForm)}
      isLoading={isLoading}
      error={errorMessage}
      submitText={t('action.save')}
      cancelText={t('action.cancel')}
    >
      <FieldGroup>
        <Field data-invalid={!!errors.borrowerCode}>
          <FieldLabel htmlFor="borrower-code">{t('field.borrowerCode')}</FieldLabel>
          <FieldContent>
            <Input id="borrower-code" disabled={isLoading} placeholder={t('field.borrowerCodePlaceholder')} {...register('borrowerCode')} />
          </FieldContent>
          <FieldError>{errors.borrowerCode?.message}</FieldError>
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

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="borrower-email">{t('field.email')}</FieldLabel>
          <FieldContent>
            <Input id="borrower-email" type="email" disabled={isLoading} placeholder={t('field.emailPlaceholder')} {...register('email')} />
          </FieldContent>
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="borrower-password">{t('field.password')}</FieldLabel>
          <FieldContent>
            <Input
              id="borrower-password"
              type="password"
              disabled={isLoading}
              placeholder={borrower ? t('field.passwordPlaceholderEdit') : t('field.passwordPlaceholder')}
              {...register('password')}
            />
          </FieldContent>
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}
