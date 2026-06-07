import type { TransactionHistoryItem } from './transaction'

export interface BorrowerDashboardMetrics {
  totalBorrowed: number
  currentlyActive: number
  returnedCount: number
}

export interface BorrowerDashboardData {
  metrics: BorrowerDashboardMetrics
  recentTransactions: TransactionHistoryItem[]
  monthlyTrends: { month: string; count: number }[]
}
