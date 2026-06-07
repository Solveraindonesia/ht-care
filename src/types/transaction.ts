import type { HtCondition } from '@/types/ht'

export const TRANSACTION_STATUSES = ['BORROWED', 'RETURNED'] as const
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]

export interface TransactionHtInfo {
  id: string
  htCode: string
  brandType: string
  condition: HtCondition
  status: string
}

export interface TransactionBorrowerInfo {
  id: string
  borrowerCode: string
  fullName: string
  department: string
}

export interface Transaction {
  id: string
  htId: string
  borrowerId: string
  borrowTime: string
  returnTime: string | null
  status: TransactionStatus
  operatorId: string
  createdAt: string
  htItem: TransactionHtInfo
  borrower: TransactionBorrowerInfo
}

export interface ActiveTransaction {
  id: string
  htId: string
  borrowerId: string
  borrowTime: string
  status: TransactionStatus
  htItem: TransactionHtInfo
  borrower: TransactionBorrowerInfo
}

export interface BorrowPayload {
  htId: string
  borrowerId: string
}

export interface ReturnPayload {
  htCode: string
  returnCondition: HtCondition
}
