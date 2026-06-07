'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useUpdateProfile } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'
import { updateProfileSchema, type UpdateProfilePayload } from '@/schemas/settings.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ProfileSettings(): React.JSX.Element | null {
  const t = useTranslations('settings')
  const { data: session } = useSession()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: session?.user?.name || ''
    }
  })

  if (!session?.user) {
    return null
  }

  const onSubmit = (data: UpdateProfilePayload) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success(t('profile.success'))
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update profile.')
      }
    })
  }

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-lg font-bold">
          <User className="text-primary h-5 w-5" />
          {t('profile.title')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">{t('profile.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
          {/* Full Name */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="profile-name" className="text-foreground text-sm font-semibold">
              {t('profile.name_label')}
            </FieldLabel>
            <Input
              id="profile-name"
              {...register('name')}
              className={cn(
                'border-border bg-card focus-visible:ring-primary rounded-xl',
                errors.name && 'border-destructive focus-visible:ring-destructive'
              )}
              placeholder={t('profile.namePlaceholder')}
              disabled={isPending}
            />
            {errors.name?.message && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          {/* Email (Read-only) */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="profile-email" className="text-foreground text-sm font-semibold opacity-70">
              {t('profile.email_label')}
            </FieldLabel>
            <Input
              id="profile-email"
              type="email"
              value={session.user.email || ''}
              disabled
              className="border-border bg-muted/40 text-muted-foreground cursor-not-allowed rounded-xl"
            />
          </Field>

          {/* User Role (Read-only) */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="profile-role" className="text-foreground text-sm font-semibold opacity-70">
              {t('profile.role_label')}
            </FieldLabel>
            <Input
              id="profile-role"
              value={session.user.role || ''}
              disabled
              className="border-border bg-muted/40 text-muted-foreground cursor-not-allowed rounded-xl capitalize"
            />
            <FieldDescription className="text-muted-foreground text-xs leading-normal">{t('profile.roleDesc')}</FieldDescription>
          </Field>

          {/* Save Button */}
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 rounded-xl px-6 font-semibold text-white">
            {isPending ? t('profile.saving') : t('profile.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
