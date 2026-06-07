'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useReturnHt } from '@/hooks/use-transactions'
import { returnSchema } from '@/schemas/transaction.schema'
import { HT_CONDITIONS } from '@/types/ht'
import { toast } from 'sonner'

import type { ReturnFormData } from '@/schemas/transaction.schema'
import type { ActiveTransaction } from '@/types/transaction'
import type { SubmitHandler } from 'react-hook-form'

interface ReturnFormProps {
  activeTransaction: ActiveTransaction
  onSuccess: () => void
}

export function ReturnForm({ activeTransaction, onSuccess }: ReturnFormProps): React.JSX.Element {
  const t = useTranslations('transaction')
  const tHt = useTranslations('ht')
  const returnMutation = useReturnHt()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      htCode: activeTransaction.htItem.htCode,
      returnCondition: undefined
    }
  })

  const submitForm: SubmitHandler<ReturnFormData> = async (data): Promise<void> => {
    try {
      await returnMutation.mutateAsync(data)
      toast.success(t('return.success'))
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('return.errorGeneral')
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Transaction Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detail.transactionInfo')}</CardTitle>
          <CardDescription>{t('detail.transactionInfoDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.htCode')}</p>
              <p className="text-primary font-mono font-semibold">{activeTransaction.htItem.htCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.brandType')}</p>
              <p className="font-medium">{activeTransaction.htItem.brandType}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.borrower')}</p>
              <p className="font-medium">{activeTransaction.borrower.fullName}</p>
              <p className="text-muted-foreground text-xs">{activeTransaction.borrower.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t('detail.borrowTime')}</p>
              <p className="font-medium">{format(new Date(activeTransaction.borrowTime), 'dd MMM yyyy, HH:mm')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('return.selectCondition')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
            <FieldGroup>
              <Field data-invalid={!!errors.returnCondition}>
                <FieldLabel>{t('detail.condition')}</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="returnCondition"
                    render={({ field }): React.JSX.Element => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={returnMutation.isPending}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('return.selectConditionPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {HT_CONDITIONS.map((cond) => (
                            <SelectItem key={cond} value={cond}>
                              {tHt(`condition.${cond.toLowerCase()}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldContent>
                <FieldError>{errors.returnCondition?.message}</FieldError>
              </Field>
            </FieldGroup>

            <Button type="submit" disabled={returnMutation.isPending} className="w-full">
              {returnMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t('return.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
