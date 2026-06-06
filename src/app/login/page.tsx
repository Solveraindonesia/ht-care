'use client'

import { getLoginSchema, LoginFormData } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RadioReceiver } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations('auth.login')
  const tValidation = useTranslations('auth.login.validation')
  const tCommon = useTranslations('common')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Generate the schema with the translated messages
  const loginSchema = getLoginSchema((key) => tValidation(key))

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setErrorMsg(null)

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })

    if (result?.error) {
      setErrorMsg(t('error'))
      setIsLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e3a8a] shadow-lg">
            <RadioReceiver className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">SIP-HT</h1>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">{t('emailLabel')}</FieldLabel>
                  <FieldContent>
                    <Input id="email" type="email" placeholder="admin@htcare.com" autoComplete="email" disabled={isLoading} {...register('email')} />
                  </FieldContent>
                  <FieldError>{errors.email?.message && <span>{errors.email.message}</span>}</FieldError>
                </Field>

                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">{t('passwordLabel')}</FieldLabel>
                  <FieldContent>
                    <Input id="password" type="password" autoComplete="current-password" disabled={isLoading} {...register('password')} />
                  </FieldContent>
                  <FieldError>{errors.password?.message && <span>{errors.password.message}</span>}</FieldError>
                </Field>
              </FieldGroup>

              {errorMsg && <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">{errorMsg}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? tCommon('loading') : t('submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
