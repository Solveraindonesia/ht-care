import { prisma } from '@/lib/prisma'
import type { TransactionHistoryItem } from '@/types/transaction'
import { createServerErrorResponse, createSuccessResponse, requireAuthenticatedSession } from '@/utils/api-route'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  try {
    const transactions = await prisma.transaction.findMany({
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
