import { getDashboardData } from '@/services/dashboard.service'
import type { DashboardData } from '@/types/dashboard'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export const DASHBOARD_DATA_QUERY_KEY = ['dashboard-data'] as const

export function useDashboardData(): UseQueryResult<DashboardData, Error> {
  return useQuery<DashboardData, Error>({
    queryKey: DASHBOARD_DATA_QUERY_KEY,
    queryFn: getDashboardData
  })
}
