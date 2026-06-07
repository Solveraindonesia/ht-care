import { getReportData } from '@/services/report.service'
import type { ReportData } from '@/types/report'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export const REPORT_DATA_QUERY_KEY = ['report-data'] as const

export function useReportData(): UseQueryResult<ReportData, Error> {
  return useQuery<ReportData, Error>({
    queryKey: REPORT_DATA_QUERY_KEY,
    queryFn: getReportData
  })
}
