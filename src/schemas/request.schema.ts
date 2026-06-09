import { z } from 'zod'

export const createRequestSchema = z.object({
  htCode: z.string().trim().min(1, 'HT Code is required.')
})

export const approveRequestSchema = z.object({
  note: z.string().trim().max(500, 'Note is too long.').optional(),
  returnCondition: z.enum(['GOOD', 'LIGHT_DAMAGE', 'HEAVY_DAMAGE', 'LOST', 'OTHER']).optional()
})

export const rejectRequestSchema = z.object({
  note: z.string().trim().min(1, 'Keterangan penolakan wajib diisi (Rejection note is required).').max(500, 'Note is too long.')
})

export type CreateRequestData = z.infer<typeof createRequestSchema>
export type ApproveRequestData = z.infer<typeof approveRequestSchema>
export type RejectRequestData = z.infer<typeof rejectRequestSchema>
