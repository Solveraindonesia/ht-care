import type { TransactionHistoryItem } from './transaction'

export interface DashboardMetrics {
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

export interface DashboardData {
  metrics: DashboardMetrics
  recentTransactions: TransactionHistoryItem[]
  divisionDistribution: DivisionDistribution[]
  monthlyTrends: MonthlyTrendItem[]
}
