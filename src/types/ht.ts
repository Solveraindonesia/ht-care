export const HT_CONDITIONS = ['GOOD', 'LIGHT_DAMAGE', 'HEAVY_DAMAGE', 'LOST', 'OTHER'] as const
export const HT_STATUSES = ['AVAILABLE', 'BORROWED'] as const

export type HtCondition = (typeof HT_CONDITIONS)[number]
export type HtStatus = (typeof HT_STATUSES)[number]

export interface HtItem {
  id: string
  htCode: string
  barcode: string | null
  brandType: string
  condition: HtCondition
  status: HtStatus
  createdAt: string
  updatedAt: string
}

export interface HtCreatePayload {
  htCode: string
  barcode?: string
  brandType: string
  condition: HtCondition
  status: HtStatus
}

export interface HtUpdatePayload extends HtCreatePayload {
  id: string
}
