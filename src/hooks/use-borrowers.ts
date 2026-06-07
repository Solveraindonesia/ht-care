import { createBorrower, deleteBorrower, getBorrowers, updateBorrower } from '@/services/borrower.service'
import type { Borrower, BorrowerCreatePayload, BorrowerUpdatePayload } from '@/types/borrower'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

export const BORROWERS_QUERY_KEY = ['borrowers'] as const

export function useBorrowers(): UseQueryResult<Borrower[], Error> {
  return useQuery<Borrower[], Error>({
    queryKey: BORROWERS_QUERY_KEY,
    queryFn: getBorrowers
  })
}

export function useCreateBorrower(): UseMutationResult<Borrower, Error, BorrowerCreatePayload> {
  const queryClient = useQueryClient()

  return useMutation<Borrower, Error, BorrowerCreatePayload>({
    mutationFn: createBorrower,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: BORROWERS_QUERY_KEY })
    }
  })
}

export function useUpdateBorrower(): UseMutationResult<Borrower, Error, BorrowerUpdatePayload> {
  const queryClient = useQueryClient()

  return useMutation<Borrower, Error, BorrowerUpdatePayload>({
    mutationFn: updateBorrower,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: BORROWERS_QUERY_KEY })
    }
  })
}

export function useDeleteBorrower(): UseMutationResult<Borrower, Error, string> {
  const queryClient = useQueryClient()

  return useMutation<Borrower, Error, string>({
    mutationFn: deleteBorrower,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: BORROWERS_QUERY_KEY })
    }
  })
}
