import type { HtCondition } from '@/types/ht'

export const REQUEST_TYPES = ['BORROW', 'RETURN'] as const
export type RequestType = (typeof REQUEST_TYPES)[number]

export const REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const
export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export interface RequestHtInfo {
  id: string
  htCode: string
  brandType: string
  condition: HtCondition
  status: string
}

export interface RequestBorrowerInfo {
  id: string
  borrowerCode: string
  fullName: string
  department: string
}

export interface TransactionRequest {
  id: string
  htId: string
  borrowerId: string
  type: RequestType
  status: RequestStatus
  note: string | null
  operatorId: string | null
  createdAt: string
  updatedAt: string
  htItem: RequestHtInfo
  borrower: RequestBorrowerInfo
  operatorName?: string | null
}

export interface CreateRequestPayload {
  htCode: string
}

export interface ProcessRequestPayload {
  note?: string
  returnCondition?: HtCondition
}
