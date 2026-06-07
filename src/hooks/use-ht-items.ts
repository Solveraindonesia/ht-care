import { createHtItem, deleteHtItem, getHtItems, updateHtItem } from '@/services/ht.service'
import type { HtCreatePayload, HtItem, HtUpdatePayload } from '@/types/ht'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

export const HT_ITEMS_QUERY_KEY = ['ht-items'] as const

export function useHtItems(): UseQueryResult<HtItem[], Error> {
  return useQuery<HtItem[], Error>({
    queryKey: HT_ITEMS_QUERY_KEY,
    queryFn: getHtItems
  })
}

export function useCreateHtItem(): UseMutationResult<HtItem, Error, HtCreatePayload> {
  const queryClient = useQueryClient()

  return useMutation<HtItem, Error, HtCreatePayload>({
    mutationFn: createHtItem,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: HT_ITEMS_QUERY_KEY })
    }
  })
}

export function useUpdateHtItem(): UseMutationResult<HtItem, Error, HtUpdatePayload> {
  const queryClient = useQueryClient()

  return useMutation<HtItem, Error, HtUpdatePayload>({
    mutationFn: updateHtItem,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: HT_ITEMS_QUERY_KEY })
    }
  })
}

export function useDeleteHtItem(): UseMutationResult<HtItem, Error, string> {
  const queryClient = useQueryClient()

  return useMutation<HtItem, Error, string>({
    mutationFn: deleteHtItem,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: HT_ITEMS_QUERY_KEY })
    }
  })
}
