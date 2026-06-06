import { z } from 'zod'

type ValidationTranslationKeys = 'invalidEmail' | 'passwordMinLength'

export const getLoginSchema = (t: (key: ValidationTranslationKeys) => string) =>
  z.object({
    email: z.string().email({ message: t('invalidEmail') }),
    password: z.string().min(6, { message: t('passwordMinLength') })
  })

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>
