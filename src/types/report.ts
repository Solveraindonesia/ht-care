import type { TransactionHistoryItem } from './transaction'

export interface ReportMetrics {
  total: number
  available: number
  borrowed: number
  broken: number
}

export interface DivisionDistribution {
  department: string
  count: number
  percentage: number
}

export interface MonthlyTrendItem {
  month: string
  count: number
}

export interface ReportData {
  metrics: ReportMetrics
  recentTransactions: TransactionHistoryItem[]
  divisionDistribution: DivisionDistribution[]
  monthlyTrends: MonthlyTrendItem[]
}
