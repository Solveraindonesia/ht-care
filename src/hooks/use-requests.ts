import { BORROWER_DASHBOARD_QUERY_KEY } from '@/hooks/use-borrower-dashboard'
import { BORROWERS_QUERY_KEY } from '@/hooks/use-borrowers'
import { HT_ITEMS_QUERY_KEY } from '@/hooks/use-ht-items'
import { REPORT_DATA_QUERY_KEY } from '@/hooks/use-report'
import { AVAILABLE_BORROWERS_QUERY_KEY, TRANSACTION_HISTORY_QUERY_KEY } from '@/hooks/use-transactions'
import { approveRequest, createBorrowRequest, createReturnRequest, getRequests, rejectRequest } from '@/services/request.service'
import type { CreateRequestPayload, ProcessRequestPayload, TransactionRequest } from '@/types/request'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const REQUESTS_QUERY_KEY = ['requests'] as const

export function useRequests(status?: string): UseQueryResult<TransactionRequest[], Error> {
  return useQuery<TransactionRequest[], Error>({
    queryKey: status ? [...REQUESTS_QUERY_KEY, status] : REQUESTS_QUERY_KEY,
    queryFn: () => getRequests(status)
  })
}

export function useCreateBorrowRequest(): UseMutationResult<TransactionRequest, Error, CreateRequestPayload> {
  const queryClient = useQueryClient()

  return useMutation<TransactionRequest, Error, CreateRequestPayload>({
    mutationFn: createBorrowRequest,
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: BORROWER_DASHBOARD_QUERY_KEY })
      ])
    }
  })
}

export function useCreateReturnRequest(): UseMutationResult<TransactionRequest, Error, CreateRequestPayload> {
  const queryClient = useQueryClient()

  return useMutation<TransactionRequest, Error, CreateRequestPayload>({
    mutationFn: createReturnRequest,
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: BORROWER_DASHBOARD_QUERY_KEY })
      ])
    }
  })
}

export function useApproveRequest(): UseMutationResult<TransactionRequest, Error, { id: string; payload: ProcessRequestPayload }> {
  const queryClient = useQueryClient()

  return useMutation<TransactionRequest, Error, { id: string; payload: ProcessRequestPayload }>({
    mutationFn: ({ id, payload }) => approveRequest(id, payload),
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: HT_ITEMS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: BORROWERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: AVAILABLE_BORROWERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: TRANSACTION_HISTORY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: REPORT_DATA_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: BORROWER_DASHBOARD_QUERY_KEY })
      ])
    }
  })
}

export function useRejectRequest(): UseMutationResult<TransactionRequest, Error, { id: string; payload: ProcessRequestPayload }> {
  const queryClient = useQueryClient()

  return useMutation<TransactionRequest, Error, { id: string; payload: ProcessRequestPayload }>({
    mutationFn: ({ id, payload }) => rejectRequest(id, payload),
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: BORROWER_DASHBOARD_QUERY_KEY })
      ])
    }
  })
}
