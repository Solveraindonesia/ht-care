import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { borrowSchema } from '@/schemas/transaction.schema'
import {
  createErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  requireAuthenticatedSession
} from '@/utils/api-route'
import { getServerSession } from 'next-auth'

import type { Transaction } from '@/types/transaction'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized.', 401)
  }

  try {
    const payload: unknown = await request.json()
    const validation = borrowSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { htId, borrowerId } = validation.data

    // Validate HT exists and is available
    const htItem = await prisma.hT_Item.findUnique({ where: { id: htId } })

    if (!htItem) {
      return createErrorResponse('HT item not found.', 404)
    }

    if (htItem.status !== 'AVAILABLE') {
      return createErrorResponse('This HT is already borrowed and cannot be borrowed again.', 400)
    }

    // Validate borrower exists
    const borrower = await prisma.borrower.findUnique({ where: { id: borrowerId } })

    if (!borrower) {
      return createErrorResponse('Borrower not found.', 404)
    }

    // Check if borrower already has an active transaction
    const existingTransaction = await prisma.transaction.findFirst({
      where: { borrower_id: borrowerId, status: 'BORROWED' }
    })

    if (existingTransaction) {
      return createErrorResponse('This borrower already has an active borrow. Return the current HT first.', 400)
    }

    // Atomic transaction: create record + update HT status
    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          ht_id: htId,
          borrower_id: borrowerId,
          operator_id: session.user.id,
          status: 'BORROWED'
        },
        include: {
          ht_item: true,
          borrower: true
        }
      }),
      prisma.hT_Item.update({
        where: { id: htId },
        data: { status: 'BORROWED' }
      })
    ])

    const mapped: Transaction = {
      id: transaction.id,
      htId: transaction.ht_id,
      borrowerId: transaction.borrower_id,
      borrowTime: transaction.borrow_time.toISOString(),
      returnTime: null,
      status: transaction.status,
      operatorId: transaction.operator_id,
      createdAt: transaction.createdAt.toISOString(),
      htItem: {
        id: transaction.ht_item.id,
        htCode: transaction.ht_item.ht_code,
        brandType: transaction.ht_item.brand_type,
        condition: transaction.ht_item.condition,
        status: 'BORROWED'
      },
      borrower: {
        id: transaction.borrower.id,
        borrowerCode: transaction.borrower.borrower_code,
        fullName: transaction.borrower.full_name,
        department: transaction.borrower.department
      }
    }

    return createSuccessResponse(mapped, 'HT borrowed successfully.', 201)
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to process borrow transaction.')
  }
}
