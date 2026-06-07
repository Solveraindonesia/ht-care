import { z } from 'zod'

export const borrowSchema = z.object({
  htId: z.string().min(1, 'HT ID is required.'),
  borrowerId: z.string().min(1, 'Borrower ID is required.')
})

export const returnSchema = z.object({
  htCode: z.string().min(1, 'HT Code is required.'),
  returnCondition: z.enum(['GOOD', 'LIGHT_DAMAGE', 'HEAVY_DAMAGE', 'LOST', 'OTHER'], {
    message: 'Return condition is required.'
  })
})

export type BorrowFormData = z.infer<typeof borrowSchema>
export type ReturnFormData = z.infer<typeof returnSchema>
