'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

import { HtConditionBadge, HtStatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAvailableBorrowers, useBorrowHt } from '@/hooks/use-transactions'
import { borrowSchema } from '@/schemas/transaction.schema'
import { toast } from 'sonner'

import type { BorrowFormData } from '@/schemas/transaction.schema'
import type { HtItem } from '@/types/ht'
import type { SubmitHandler } from 'react-hook-form'

interface BorrowFormProps {
  htItem: HtItem
  onSuccess: () => void
}

export function BorrowForm({ htItem, onSuccess }: BorrowFormProps): React.JSX.Element {
  const t = useTranslations('transaction')
  const tHt = useTranslations('ht')
  const { data: borrowers, isLoading: isBorrowersLoading } = useAvailableBorrowers()
  const borrowMutation = useBorrowHt()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<BorrowFormData>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      htId: htItem.id,
      borrowerId: ''
    }
  })

  const submitForm: SubmitHandler<BorrowFormData> = async (data): Promise<void> => {
    try {
      await borrowMutation.mutateAsync(data)
      toast.success(t('borrow.success'))
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('borrow.errorGeneral')
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* HT Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detail.htInfo')}</CardTitle>
          <CardDescription>{t('detail.htInfoDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.htCode')}</p>
              <p className="text-primary font-mono font-semibold">{htItem.htCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.brandType')}</p>
              <p className="font-medium">{htItem.brandType}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.condition')}</p>
              <HtConditionBadge condition={htItem.condition} label={tHt(`condition.${htItem.condition.toLowerCase()}`)} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.status')}</p>
              <HtStatusBadge status={htItem.status} label={htItem.status === 'AVAILABLE' ? tHt('status.available') : tHt('status.borrowed')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Borrow Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('borrow.selectBorrower')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
            <FieldGroup>
              <Field data-invalid={!!errors.borrowerId}>
                <FieldLabel>{t('detail.borrower')}</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="borrowerId"
                    render={({ field }): React.JSX.Element => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={isBorrowersLoading || borrowMutation.isPending}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('borrow.selectBorrowerPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {borrowers?.map((borrower) => (
                            <SelectItem key={borrower.id} value={borrower.id}>
                              {borrower.fullName} ({borrower.borrowerCode}) — {borrower.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldContent>
                <FieldError>{errors.borrowerId?.message}</FieldError>
              </Field>
            </FieldGroup>

            <Button type="submit" disabled={borrowMutation.isPending} className="w-full">
              {borrowMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t('borrow.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
