import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createServerErrorResponse, createSuccessResponse } from '@/utils/api-route'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'BORROWER') {
      return createErrorResponse('Unauthorized.', 401)
    }

    const borrowerId = session.user.id

    // 1. Calculate borrower metrics
    const [totalBorrowed, currentlyActive, returnedCount] = await Promise.all([
      prisma.transaction.count({ where: { borrower_id: borrowerId } }),
      prisma.transaction.count({ where: { borrower_id: borrowerId, status: 'BORROWED' } }),
      prisma.transaction.count({ where: { borrower_id: borrowerId, status: 'RETURNED' } })
    ])

    // 2. Fetch recent transactions for this borrower
    const recentDb = await prisma.transaction.findMany({
      where: { borrower_id: borrowerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        ht_item: true,
        borrower: true
      }
    })

    const recentTransactions = recentDb.map((t) => ({
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

    // 3. Monthly Trends for this borrower (last 6 months)
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
        borrower_id: borrowerId,
        borrow_time: { gte: sixMonthsAgo }
      },
      select: { borrow_time: true }
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

    return createSuccessResponse(
      {
        metrics: {
          totalBorrowed,
          currentlyActive,
          returnedCount
        },
        recentTransactions,
        monthlyTrends
      },
      'Borrower dashboard data loaded successfully.'
    )
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load borrower metrics.')
  }
}
