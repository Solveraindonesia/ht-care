'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useUpdatePassword } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'
import { updatePasswordSchema, type UpdatePasswordPayload } from '@/schemas/settings.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function PasswordSettings(): React.JSX.Element {
  const t = useTranslations('settings')
  const { mutate: updatePassword, isPending } = useUpdatePassword()

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdatePasswordPayload>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const onSubmit = (data: UpdatePasswordPayload) => {
    updatePassword(data, {
      onSuccess: () => {
        toast.success(t('password.success'))
        reset()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update password.')
      }
    })
  }

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-lg font-bold">
          <KeyRound className="text-primary h-5 w-5" />
          {t('password.title')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">{t('password.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
          {/* Current Password */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="current-password" className="text-foreground text-sm font-semibold">
              {t('password.current')}
            </FieldLabel>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                {...register('currentPassword')}
                className={cn(
                  'border-border bg-card focus-visible:ring-primary rounded-xl pr-10',
                  errors.currentPassword && 'border-destructive focus-visible:ring-destructive'
                )}
                placeholder={t('password.currentPlaceholder')}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer focus:outline-none"
                title={showCurrent ? t('password.hidePassword') : t('password.showPassword')}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword?.message && <FieldError>{errors.currentPassword.message}</FieldError>}
          </Field>

          {/* New Password */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="new-password" className="text-foreground text-sm font-semibold">
              {t('password.new')}
            </FieldLabel>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                {...register('newPassword')}
                className={cn(
                  'border-border bg-card focus-visible:ring-primary rounded-xl pr-10',
                  errors.newPassword && 'border-destructive focus-visible:ring-destructive'
                )}
                placeholder={t('password.newPlaceholder')}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer focus:outline-none"
                title={showNew ? t('password.hidePassword') : t('password.showPassword')}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword?.message && <FieldError>{errors.newPassword.message}</FieldError>}
          </Field>

          {/* Confirm New Password */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="confirm-password" className="text-foreground text-sm font-semibold">
              {t('password.confirm')}
            </FieldLabel>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmNewPassword')}
                className={cn(
                  'border-border bg-card focus-visible:ring-primary rounded-xl pr-10',
                  errors.confirmNewPassword && 'border-destructive focus-visible:ring-destructive'
                )}
                placeholder={t('password.confirmPlaceholder')}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer focus:outline-none"
                title={showConfirm ? t('password.hidePassword') : t('password.showPassword')}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmNewPassword?.message && <FieldError>{errors.confirmNewPassword.message}</FieldError>}
          </Field>

          {/* Save Button */}
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 rounded-xl px-6 font-semibold text-white">
            {isPending ? t('password.saving') : t('password.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
