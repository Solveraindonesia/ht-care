import { BORROWERS_QUERY_KEY } from '@/hooks/use-borrowers'
import { DASHBOARD_DATA_QUERY_KEY } from '@/hooks/use-dashboard'
import { HT_ITEMS_QUERY_KEY } from '@/hooks/use-ht-items'
import { borrowHt, getActiveTransaction, getAvailableBorrowers, getHtByCode, getTransactionHistory, returnHt } from '@/services/transaction.service'
import type { Borrower } from '@/types/borrower'
import type { HtItem } from '@/types/ht'
import type { ActiveTransaction, BorrowPayload, ReturnPayload, Transaction, TransactionHistoryItem } from '@/types/transaction'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const AVAILABLE_BORROWERS_QUERY_KEY = ['available-borrowers'] as const
export const TRANSACTION_HISTORY_QUERY_KEY = ['transaction-history'] as const

export function useHtByCode(code: string): UseQueryResult<HtItem, Error> {
  return useQuery<HtItem, Error>({
    queryKey: ['ht-by-code', code],
    queryFn: () => getHtByCode(code),
    enabled: code.length > 0,
    retry: false
  })
}

export function useAvailableBorrowers(): UseQueryResult<Borrower[], Error> {
  return useQuery<Borrower[], Error>({
    queryKey: AVAILABLE_BORROWERS_QUERY_KEY,
    queryFn: getAvailableBorrowers
  })
}

export function useActiveTransaction(htCode: string): UseQueryResult<ActiveTransaction, Error> {
  return useQuery<ActiveTransaction, Error>({
    queryKey: ['active-transaction', htCode],
    queryFn: () => getActiveTransaction(htCode),
    enabled: htCode.length > 0,
    retry: false
  })
}

export function useBorrowHt(): UseMutationResult<Transaction, Error, BorrowPayload> {
  const queryClient = useQueryClient()

  return useMutation<Transaction, Error, BorrowPayload>({
    mutationFn: borrowHt,
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: HT_ITEMS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: BORROWERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: AVAILABLE_BORROWERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DASHBOARD_DATA_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: TRANSACTION_HISTORY_QUERY_KEY })
      ])
    }
  })
}

export function useReturnHt(): UseMutationResult<Transaction, Error, ReturnPayload> {
  const queryClient = useQueryClient()

  return useMutation<Transaction, Error, ReturnPayload>({
    mutationFn: returnHt,
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: HT_ITEMS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: BORROWERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: AVAILABLE_BORROWERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DASHBOARD_DATA_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: TRANSACTION_HISTORY_QUERY_KEY })
      ])
    }
  })
}

export function useTransactionHistory(): UseQueryResult<TransactionHistoryItem[], Error> {
  return useQuery<TransactionHistoryItem[], Error>({
    queryKey: TRANSACTION_HISTORY_QUERY_KEY,
    queryFn: getTransactionHistory
  })
}
