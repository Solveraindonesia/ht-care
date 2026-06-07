import type { ApiResponse } from '@/types/api'
import type { ReportData } from '@/types/report'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

export async function getReportData(): Promise<ReportData> {
  try {
    const response = await axios.get<ApiResponse<ReportData>>('/api/report/metrics')
    return unwrapApiResponse(response.data, 'Failed to load report data.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load report data.'))
  }
}
