import type { ApiResponse } from '@/types/api'
import type { BorrowerDashboardData } from '@/types/borrower-dashboard'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

const BORROWER_DASHBOARD_API_URL = '/api/borrower/metrics'

export async function getBorrowerDashboardData(): Promise<BorrowerDashboardData> {
  try {
    const response = await axios.get<ApiResponse<BorrowerDashboardData>>(BORROWER_DASHBOARD_API_URL)
    return unwrapApiResponse(response.data, 'Failed to load dashboard data.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load dashboard data.'))
  }
}
