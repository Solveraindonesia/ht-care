import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createRequestSchema } from '@/schemas/request.schema'
import {
  createErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  requireAuthenticatedSession
} from '@/utils/api-route'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'BORROWER') {
    return createErrorResponse('Unauthorized. Only borrowers can request to return HT.', 403)
  }

  const borrowerId = session.user.id

  try {
    const payload: unknown = await request.json()
    const validation = createRequestSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { htCode } = validation.data

    // 1. Find HT Item
    const htItem = await prisma.hT_Item.findFirst({
      where: {
        OR: [{ ht_code: htCode }, { barcode: htCode }]
      }
    })

    if (!htItem) {
      return createErrorResponse('HT unit not found.', 404)
    }

    // 2. Verify borrower holds this HT in active transaction
    const activeTransaction = await prisma.transaction.findFirst({
      where: {
        borrower_id: borrowerId,
        ht_id: htItem.id,
        status: 'BORROWED'
      }
    })

    if (!activeTransaction) {
      return createErrorResponse('You do not currently have this HT logged out under an active loan.', 400)
    }

    // 3. Check if borrower already has a pending request for this HT unit
    const pendingRequest = await prisma.transactionRequest.findFirst({
      where: { borrower_id: borrowerId, status: 'PENDING', ht_id: htItem.id }
    })

    if (pendingRequest) {
      return createErrorResponse('You already have a pending request for this HT unit. Please wait for Admin approval.', 400)
    }

    // 4. Create return request
    const transactionRequest = await prisma.transactionRequest.create({
      data: {
        ht_id: htItem.id,
        borrower_id: borrowerId,
        type: 'RETURN',
        status: 'PENDING'
      },
      include: {
        ht_item: true,
        borrower: true
      }
    })

    return createSuccessResponse(transactionRequest, 'Return request submitted successfully.', 201)
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to submit return request.')
  }
}
