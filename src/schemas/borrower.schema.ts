import { z } from 'zod'

export interface BorrowerFormData {
  borrowerCode: string
  barcode?: string
  fullName: string
  department: string
  email: string
  password?: string
}

interface BorrowerValidationMessages {
  borrowerCodeRequired: string
  borrowerCodeMax: string
  barcodeMax: string
  barcodeInvalid: string
  fullNameRequired: string
  fullNameMax: string
  departmentRequired: string
  departmentMax: string
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
  passwordMin: string
  idRequired: string
}

export type BorrowerValidationKey = keyof BorrowerValidationMessages

const BARCODE_PATTERN = /^[A-Za-z0-9_-]+$/

const DEFAULT_BORROWER_VALIDATION_MESSAGES: BorrowerValidationMessages = {
  borrowerCodeRequired: 'Borrower code is required.',
  borrowerCodeMax: 'Borrower code must be 32 characters or less.',
  barcodeMax: 'Barcode must be 64 characters or less.',
  barcodeInvalid: 'Barcode can only contain letters, numbers, hyphens, and underscores.',
  fullNameRequired: 'Full name is required.',
  fullNameMax: 'Full name must be 100 characters or less.',
  departmentRequired: 'Department is required.',
  departmentMax: 'Department must be 100 characters or less.',
  emailRequired: 'Email is required.',
  emailInvalid: 'Invalid email address.',
  passwordRequired: 'Password is required.',
  passwordMin: 'Password must be at least 8 characters.',
  idRequired: 'ID is required.'
}

function createOptionalBarcodeSchema(messages: BorrowerValidationMessages): z.ZodType<string | undefined, string | undefined> {
  return z
    .string()
    .trim()
    .max(64, { message: messages.barcodeMax })
    .refine((value) => value.length === 0 || BARCODE_PATTERN.test(value), { message: messages.barcodeInvalid })
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional()
}

export const borrowerCreateSchema = z.object({
  borrowerCode: z
    .string()
    .trim()
    .min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.borrowerCodeRequired)
    .max(32, DEFAULT_BORROWER_VALIDATION_MESSAGES.borrowerCodeMax),
  barcode: createOptionalBarcodeSchema(DEFAULT_BORROWER_VALIDATION_MESSAGES),
  fullName: z
    .string()
    .trim()
    .min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.fullNameRequired)
    .max(100, DEFAULT_BORROWER_VALIDATION_MESSAGES.fullNameMax),
  department: z
    .string()
    .trim()
    .min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.departmentRequired)
    .max(100, DEFAULT_BORROWER_VALIDATION_MESSAGES.departmentMax),
  email: z.string().trim().min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.emailRequired).email(DEFAULT_BORROWER_VALIDATION_MESSAGES.emailInvalid),
  password: z.string().min(8, DEFAULT_BORROWER_VALIDATION_MESSAGES.passwordMin)
})

export const borrowerUpdateSchema = z.object({
  id: z.string().trim().min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.idRequired),
  borrowerCode: z
    .string()
    .trim()
    .min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.borrowerCodeRequired)
    .max(32, DEFAULT_BORROWER_VALIDATION_MESSAGES.borrowerCodeMax),
  barcode: createOptionalBarcodeSchema(DEFAULT_BORROWER_VALIDATION_MESSAGES),
  fullName: z
    .string()
    .trim()
    .min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.fullNameRequired)
    .max(100, DEFAULT_BORROWER_VALIDATION_MESSAGES.fullNameMax),
  department: z
    .string()
    .trim()
    .min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.departmentRequired)
    .max(100, DEFAULT_BORROWER_VALIDATION_MESSAGES.departmentMax),
  email: z.string().trim().min(1, DEFAULT_BORROWER_VALIDATION_MESSAGES.emailRequired).email(DEFAULT_BORROWER_VALIDATION_MESSAGES.emailInvalid),
  password: z.string().min(8, DEFAULT_BORROWER_VALIDATION_MESSAGES.passwordMin).optional().or(z.literal(''))
})

export const borrowerDeleteSchema = z.object({
  id: z.string().trim().min(1, { message: DEFAULT_BORROWER_VALIDATION_MESSAGES.idRequired })
})

export function getBorrowerFormSchema(t: (key: BorrowerValidationKey) => string, isEdit: boolean): z.ZodType<BorrowerFormData, BorrowerFormData> {
  return z.object({
    borrowerCode: z.string().trim().min(1, t('borrowerCodeRequired')).max(32, t('borrowerCodeMax')),
    barcode: z
      .string()
      .trim()
      .max(64, t('barcodeMax'))
      .refine((v) => v.length === 0 || BARCODE_PATTERN.test(v), t('barcodeInvalid'))
      .transform((v) => (v.length > 0 ? v : undefined))
      .optional(),
    fullName: z.string().trim().min(1, t('fullNameRequired')).max(100, t('fullNameMax')),
    department: z.string().trim().min(1, t('departmentRequired')).max(100, t('departmentMax')),
    email: z.string().trim().min(1, t('emailRequired')).email(t('emailInvalid')),
    password: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (isEdit) {
            return !val || val.trim().length === 0 || val.length >= 8
          }
          return val !== undefined && val.trim().length >= 8
        },
        { message: t('passwordMin') }
      )
  })
}
