import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { TransactionHistoryItem } from '@/types/transaction'
import { createErrorResponse, createServerErrorResponse, createSuccessResponse } from '@/utils/api-route'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return createErrorResponse('Unauthorized.', 401)
  }

  try {
    const where: { borrower_id?: string } = {}
    if (session.user.role === 'BORROWER') {
      where.borrower_id = session.user.id
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        ht_item: true,
        borrower: true
      }
    })

    const mapped: TransactionHistoryItem[] = transactions.map((t) => ({
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

    return createSuccessResponse(mapped, 'Transaction history loaded successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load transaction history.')
  }
}
