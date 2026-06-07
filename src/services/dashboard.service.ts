import type { ApiResponse } from '@/types/api'
import type { DashboardData } from '@/types/dashboard'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const response = await axios.get<ApiResponse<DashboardData>>('/api/dashboard/metrics')
    return unwrapApiResponse(response.data, 'Failed to load dashboard data.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load dashboard data.'))
  }
}
