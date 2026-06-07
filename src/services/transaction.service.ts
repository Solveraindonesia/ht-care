import type { ApiResponse } from '@/types/api'
import type { Borrower } from '@/types/borrower'
import type { HtItem } from '@/types/ht'
import type { ActiveTransaction, BorrowPayload, ReturnPayload, Transaction, TransactionHistoryItem } from '@/types/transaction'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

export async function getHtByCode(code: string): Promise<HtItem> {
  try {
    const response = await axios.get<ApiResponse<HtItem>>(`/api/ht/code/${encodeURIComponent(code)}`)
    return unwrapApiResponse(response.data, 'Failed to load HT item.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load HT item.'))
  }
}

export async function getAvailableBorrowers(): Promise<Borrower[]> {
  try {
    const response = await axios.get<ApiResponse<Borrower[]>>('/api/borrowers/available')
    return unwrapApiResponse(response.data, 'Failed to load available borrowers.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load available borrowers.'))
  }
}

export async function getActiveTransaction(htCode: string): Promise<ActiveTransaction> {
  try {
    const response = await axios.get<ApiResponse<ActiveTransaction>>(`/api/transactions/active/${encodeURIComponent(htCode)}`)
    return unwrapApiResponse(response.data, 'Failed to load active transaction.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load active transaction.'))
  }
}

export async function borrowHt(payload: BorrowPayload): Promise<Transaction> {
  try {
    const response = await axios.post<ApiResponse<Transaction>>('/api/transactions/borrow', payload)
    return unwrapApiResponse(response.data, 'Failed to process borrow transaction.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to process borrow transaction.'))
  }
}

export async function returnHt(payload: ReturnPayload): Promise<Transaction> {
  try {
    const response = await axios.post<ApiResponse<Transaction>>('/api/transactions/return', payload)
    return unwrapApiResponse(response.data, 'Failed to process return transaction.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to process return transaction.'))
  }
}

export async function getTransactionHistory(): Promise<TransactionHistoryItem[]> {
  try {
    const response = await axios.get<ApiResponse<TransactionHistoryItem[]>>('/api/transactions/history')
    return unwrapApiResponse(response.data, 'Failed to load transaction history.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load transaction history.'))
  }
}
