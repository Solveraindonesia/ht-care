import { prisma } from '@/lib/prisma'
import { createErrorResponse, createServerErrorResponse, createSuccessResponse, requireAuthenticatedSession } from '@/utils/api-route'

import type { ActiveTransaction } from '@/types/transaction'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ htCode: string }> }): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  const { htCode } = await params

  try {
    const htItem = await prisma.hT_Item.findFirst({
      where: {
        OR: [{ ht_code: htCode }, { barcode: htCode }]
      }
    })

    if (!htItem) {
      return createErrorResponse('HT item not found.', 404)
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        ht_id: htItem.id,
        status: 'BORROWED'
      },
      include: {
        ht_item: true,
        borrower: true
      }
    })

    if (!transaction) {
      return createErrorResponse('No active transaction found for this HT.', 404)
    }

    const activeTransaction: ActiveTransaction = {
      id: transaction.id,
      htId: transaction.ht_id,
      borrowerId: transaction.borrower_id,
      borrowTime: transaction.borrow_time.toISOString(),
      status: transaction.status,
      htItem: {
        id: transaction.ht_item.id,
        htCode: transaction.ht_item.ht_code,
        brandType: transaction.ht_item.brand_type,
        condition: transaction.ht_item.condition,
        status: transaction.ht_item.status
      },
      borrower: {
        id: transaction.borrower.id,
        borrowerCode: transaction.borrower.borrower_code,
        fullName: transaction.borrower.full_name,
        department: transaction.borrower.department
      }
    }

    return createSuccessResponse(activeTransaction, 'Active transaction loaded successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load active transaction.')
  }
}
