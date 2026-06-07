import { z } from 'zod'

export interface BorrowerFormData {
  borrowerCode: string
  barcode?: string
  fullName: string
  department: string
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

function createBorrowerBaseSchema(messages: BorrowerValidationMessages): z.ZodType<BorrowerFormData, BorrowerFormData> {
  return z.object({
    borrowerCode: z.string().trim().min(1, { message: messages.borrowerCodeRequired }).max(32, { message: messages.borrowerCodeMax }),
    barcode: createOptionalBarcodeSchema(messages),
    fullName: z.string().trim().min(1, { message: messages.fullNameRequired }).max(100, { message: messages.fullNameMax }),
    department: z.string().trim().min(1, { message: messages.departmentRequired }).max(100, { message: messages.departmentMax })
  })
}

export const borrowerCreateSchema = createBorrowerBaseSchema(DEFAULT_BORROWER_VALIDATION_MESSAGES)

export const borrowerUpdateSchema = borrowerCreateSchema.and(
  z.object({
    id: z.string().trim().min(1, { message: DEFAULT_BORROWER_VALIDATION_MESSAGES.idRequired })
  })
)

export const borrowerDeleteSchema = z.object({
  id: z.string().trim().min(1, { message: DEFAULT_BORROWER_VALIDATION_MESSAGES.idRequired })
})

export function getBorrowerFormSchema(t: (key: BorrowerValidationKey) => string): typeof borrowerCreateSchema {
  return createBorrowerBaseSchema({
    borrowerCodeRequired: t('borrowerCodeRequired'),
    borrowerCodeMax: t('borrowerCodeMax'),
    barcodeMax: t('barcodeMax'),
    barcodeInvalid: t('barcodeInvalid'),
    fullNameRequired: t('fullNameRequired'),
    fullNameMax: t('fullNameMax'),
    departmentRequired: t('departmentRequired'),
    departmentMax: t('departmentMax'),
    idRequired: t('idRequired')
  })
}
