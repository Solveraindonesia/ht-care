import { prisma } from '@/lib/prisma'
import type { DashboardData } from '@/types/dashboard'
import type { TransactionHistoryItem } from '@/types/transaction'
import { createServerErrorResponse, createSuccessResponse, requireAuthenticatedSession } from '@/utils/api-route'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  try {
    // 1. Calculate counts
    const [total, available, borrowed, broken] = await Promise.all([
      prisma.hT_Item.count(),
      prisma.hT_Item.count({ where: { status: 'AVAILABLE' } }),
      prisma.hT_Item.count({ where: { status: 'BORROWED' } }),
      prisma.hT_Item.count({
        where: {
          condition: {
            in: ['LIGHT_DAMAGE', 'HEAVY_DAMAGE']
          }
        }
      })
    ])

    // 2. Fetch recent transactions (limit to 5)
    const recentDb = await prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        ht_item: true,
        borrower: true
      }
    })

    const recentTransactions: TransactionHistoryItem[] = recentDb.map((t) => ({
      id: t.id,
      htCode: t.ht_item.ht_code,
      brandType: t.ht_item.brand_type,
      borrowerName: t.borrower.full_name,
      borrowerCode: t.borrower.borrower_code,
      department: t.borrower.department,
      borrowTime: t.borrow_time.toISOString(),
      returnTime: t.return_time?.toISOString() ?? null,
      status: t.status
    }))

    // 3. Division Distribution (active borrows by department)
    const activeTransactions = await prisma.transaction.findMany({
      where: {
        status: 'BORROWED'
      },
      include: {
        borrower: true
      }
    })

    const totalActive = activeTransactions.length
    const departmentCounts: Record<string, number> = {}

    activeTransactions.forEach((t) => {
      const dept = t.borrower.department || 'Other'
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1
    })

    const divisionDistribution = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
      percentage: totalActive > 0 ? Math.round((count / totalActive) * 100) : 0
    }))

    // Sort by count desc
    divisionDistribution.sort((a, b) => b.count - a.count)

    // 4. Monthly Trends (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const trendList: { month: string; count: number; date: Date }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      trendList.push({
        month: `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        count: 0,
        date: d
      })
    }

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const historicalTransactions = await prisma.transaction.findMany({
      where: {
        borrow_time: {
          gte: sixMonthsAgo
        }
      },
      select: {
        borrow_time: true
      }
    })

    historicalTransactions.forEach((t) => {
      const tDate = new Date(t.borrow_time)
      const matchingTrend = trendList.find((trend) => trend.date.getMonth() === tDate.getMonth() && trend.date.getFullYear() === tDate.getFullYear())
      if (matchingTrend) {
        matchingTrend.count++
      }
    })

    const monthlyTrends = trendList.map((t) => ({
      month: t.month,
      count: t.count
    }))

    const dashboardData: DashboardData = {
      metrics: {
        total,
        available,
        borrowed,
        broken
      },
      recentTransactions,
      divisionDistribution,
      monthlyTrends
    }

    return createSuccessResponse(dashboardData, 'Dashboard data loaded successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load dashboard metrics.')
  }
}
