import { getBorrowerDashboardData } from '@/services/borrower-dashboard.service'
import type { BorrowerDashboardData } from '@/types/borrower-dashboard'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export const BORROWER_DASHBOARD_QUERY_KEY = ['borrower-dashboard-data'] as const

export function useBorrowerDashboard(): UseQueryResult<BorrowerDashboardData, Error> {
  return useQuery<BorrowerDashboardData, Error>({
    queryKey: BORROWER_DASHBOARD_QUERY_KEY,
    queryFn: getBorrowerDashboardData
  })
}
