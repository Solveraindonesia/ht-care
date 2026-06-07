import { prisma } from '@/lib/prisma'
import { returnSchema } from '@/schemas/transaction.schema'
import {
  createErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  requireAuthenticatedSession
} from '@/utils/api-route'

import type { Transaction } from '@/types/transaction'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  try {
    const payload: unknown = await request.json()
    const validation = returnSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { htCode, returnCondition } = validation.data

    // Find the HT by code
    const htItem = await prisma.hT_Item.findFirst({
      where: {
        OR: [{ ht_code: htCode }, { barcode: htCode }]
      }
    })

    if (!htItem) {
      return createErrorResponse('HT item not found.', 404)
    }

    // Find the active transaction
    const activeTransaction = await prisma.transaction.findFirst({
      where: {
        ht_id: htItem.id,
        status: 'BORROWED'
      }
    })

    if (!activeTransaction) {
      return createErrorResponse('This HT is not currently borrowed.', 400)
    }

    // Atomic transaction: update record + update HT status and condition
    const [transaction] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id: activeTransaction.id },
        data: {
          status: 'RETURNED',
          return_time: new Date()
        },
        include: {
          ht_item: true,
          borrower: true
        }
      }),
      prisma.hT_Item.update({
        where: { id: htItem.id },
        data: {
          status: 'AVAILABLE',
          condition: returnCondition
        }
      })
    ])

    const mapped: Transaction = {
      id: transaction.id,
      htId: transaction.ht_id,
      borrowerId: transaction.borrower_id,
      borrowTime: transaction.borrow_time.toISOString(),
      returnTime: transaction.return_time?.toISOString() ?? null,
      status: transaction.status,
      operatorId: transaction.operator_id,
      createdAt: transaction.createdAt.toISOString(),
      htItem: {
        id: transaction.ht_item.id,
        htCode: transaction.ht_item.ht_code,
        brandType: transaction.ht_item.brand_type,
        condition: returnCondition,
        status: 'AVAILABLE'
      },
      borrower: {
        id: transaction.borrower.id,
        borrowerCode: transaction.borrower.borrower_code,
        fullName: transaction.borrower.full_name,
        department: transaction.borrower.department
      }
    }

    return createSuccessResponse(mapped, 'HT returned successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to process return transaction.')
  }
}
