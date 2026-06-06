'use client'

import { getLoginSchema, LoginFormData } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Lock, RadioReceiver, User } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations('auth.login')
  const tValidation = useTranslations('auth.login.validation')
  const tCommon = useTranslations('common')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    <div
      className="selection:bg-primary-container selection:text-on-primary-container flex min-h-screen items-center justify-center p-6 antialiased sm:p-12"
      style={{
        background: `linear-gradient(rgba(0, 35, 111, 0.8), rgba(0, 35, 111, 0.85)), url('/images/bg-login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="animate-in fade-in zoom-in w-full max-w-lg space-y-8 duration-500 lg:max-w-xl">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md">
            <RadioReceiver className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-12">
          {/* Header */}
          <div className="mb-10 space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('title')}</h1>
            <p className="text-lg text-white/80">{t('description')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className="mb-1.5 text-sm font-medium text-white/90">
                  {t('emailLabel')}
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <User className="h-5 w-5 text-white/60" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@htcare.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="focus-visible:ring-primary-fixed h-14 rounded-xl border-white/20 bg-white/10 pl-12 text-base text-white transition-all placeholder:text-white/50 focus-visible:border-transparent focus-visible:ring-2"
                      {...register('email')}
                    />
                  </div>
                </FieldContent>
                <FieldError className="font-medium text-red-300">{errors.email?.message && <span>{errors.email.message}</span>}</FieldError>
              </Field>

              <Field data-invalid={!!errors.password} className="mt-4">
                <FieldLabel htmlFor="password" className="mb-1.5 text-sm font-medium text-white/90">
                  {t('passwordLabel')}
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Lock className="h-5 w-5 text-white/60" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="focus-visible:ring-primary-fixed h-14 rounded-xl border-white/20 bg-white/10 pl-12 text-base text-white transition-all placeholder:text-white/50 focus-visible:border-transparent focus-visible:ring-2"
                      {...register('password')}
                    />
                  </div>
                </FieldContent>
                <FieldError className="font-medium text-red-300">{errors.password?.message && <span>{errors.password.message}</span>}</FieldError>
              </Field>
            </FieldGroup>

            {errorMsg && (
              <div className="bg-destructive/80 flex items-center gap-3 rounded-xl p-4 text-sm font-medium text-white shadow-sm">
                <AlertCircle className="h-5 w-5" />
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              className="bg-primary-container text-on-primary hover:bg-primary mt-6 h-14 w-full rounded-xl border border-transparent text-lg font-semibold transition-all hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
              {isLoading ? tCommon('loading') : t('submit')}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-white/80">
          Belum punya akun?{' '}
          <a href="#" className="text-primary-fixed font-semibold transition-colors duration-200 hover:text-white">
            Hubungi administrator sistem.
          </a>
        </p>
      </div>
    </div>
  )
}
