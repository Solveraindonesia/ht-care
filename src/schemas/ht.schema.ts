import { HT_CONDITIONS, HT_STATUSES } from '@/types/ht'
import { z } from 'zod'

import type { HtCondition, HtStatus } from '@/types/ht'

export interface HtFormData {
  htCode: string
  barcode?: string
  brandType: string
  condition: HtCondition
  status: HtStatus
}

interface HtValidationMessages {
  htCodeRequired: string
  htCodeMax: string
  barcodeMax: string
  barcodeInvalid: string
  brandTypeRequired: string
  brandTypeMax: string
  conditionRequired: string
  statusRequired: string
  idRequired: string
}

export type HtValidationKey = keyof HtValidationMessages

const BARCODE_PATTERN = /^[A-Za-z0-9_-]+$/

const DEFAULT_HT_VALIDATION_MESSAGES: HtValidationMessages = {
  htCodeRequired: 'HT code is required.',
  htCodeMax: 'HT code must be 32 characters or less.',
  barcodeMax: 'Barcode must be 64 characters or less.',
  barcodeInvalid: 'Barcode can only contain letters, numbers, hyphens, and underscores.',
  brandTypeRequired: 'Brand or type is required.',
  brandTypeMax: 'Brand or type must be 100 characters or less.',
  conditionRequired: 'Condition is required.',
  statusRequired: 'Status is required.',
  idRequired: 'ID is required.'
}

function createOptionalBarcodeSchema(messages: HtValidationMessages): z.ZodType<string | undefined, string | undefined> {
  return z
    .string()
    .trim()
    .max(64, { message: messages.barcodeMax })
    .refine((value) => value.length === 0 || BARCODE_PATTERN.test(value), { message: messages.barcodeInvalid })
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional()
}

function createHtBaseSchema(messages: HtValidationMessages): z.ZodType<HtFormData, HtFormData> {
  return z.object({
    htCode: z.string().trim().min(1, { message: messages.htCodeRequired }).max(32, { message: messages.htCodeMax }),
    barcode: createOptionalBarcodeSchema(messages),
    brandType: z.string().trim().min(1, { message: messages.brandTypeRequired }).max(100, { message: messages.brandTypeMax }),
    condition: z.enum(HT_CONDITIONS, { message: messages.conditionRequired }),
    status: z.enum(HT_STATUSES, { message: messages.statusRequired })
  })
}

export const htCreateSchema = createHtBaseSchema(DEFAULT_HT_VALIDATION_MESSAGES)

export const htUpdateSchema = htCreateSchema.and(
  z.object({
    id: z.string().trim().min(1, { message: DEFAULT_HT_VALIDATION_MESSAGES.idRequired })
  })
)

export const htDeleteSchema = z.object({
  id: z.string().trim().min(1, { message: DEFAULT_HT_VALIDATION_MESSAGES.idRequired })
})

export function getHtFormSchema(t: (key: HtValidationKey) => string): typeof htCreateSchema {
  return createHtBaseSchema({
    htCodeRequired: t('htCodeRequired'),
    htCodeMax: t('htCodeMax'),
    barcodeMax: t('barcodeMax'),
    barcodeInvalid: t('barcodeInvalid'),
    brandTypeRequired: t('brandTypeRequired'),
    brandTypeMax: t('brandTypeMax'),
    conditionRequired: t('conditionRequired'),
    statusRequired: t('statusRequired'),
    idRequired: t('idRequired')
  })
}
