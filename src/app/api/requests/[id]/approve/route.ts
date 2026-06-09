import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { approveRequestSchema } from '@/schemas/request.schema'
import {
  createErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  requireAuthenticatedSession
} from '@/utils/api-route'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request, props: { params: Promise<{ id: string }> }): Promise<Response> {
  const params = await props.params
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role === 'BORROWER') {
    return createErrorResponse('Forbidden. Only operators or admins can approve requests.', 403)
  }

  const operatorId = session.user.id
  const { id } = params

  try {
    const payload: unknown = await request.json()
    const validation = approveRequestSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { note, returnCondition } = validation.data

    // 1. Find the request
    const dbRequest = await prisma.transactionRequest.findUnique({
      where: { id },
      include: {
        ht_item: true,
        borrower: true
      }
    })

    if (!dbRequest) {
      return createErrorResponse('Request not found.', 404)
    }

    if (dbRequest.status !== 'PENDING') {
      return createErrorResponse('This request has already been processed.', 400)
    }

    if (dbRequest.type === 'BORROW') {
      // --- Process Borrow Request Approval ---

      // Check if HT is still available
      if (dbRequest.ht_item.status !== 'AVAILABLE') {
        return createErrorResponse('This HT unit is no longer available.', 400)
      }

      // Execute atomic transaction
      const [approvedRequest] = await prisma.$transaction([
        prisma.transactionRequest.update({
          where: { id },
          data: {
            status: 'APPROVED',
            operator_id: operatorId,
            note: note || 'Disetujui oleh Admin'
          }
        }),
        prisma.transaction.create({
          data: {
            ht_id: dbRequest.ht_id,
            borrower_id: dbRequest.borrower_id,
            operator_id: operatorId,
            status: 'BORROWED'
          }
        }),
        prisma.hT_Item.update({
          where: { id: dbRequest.ht_id },
          data: { status: 'BORROWED' }
        })
      ])

      return createSuccessResponse(approvedRequest, 'Borrow request approved successfully.')
    } else {
      // --- Process Return Request Approval ---

      // Find active loan transaction
      const activeTransaction = await prisma.transaction.findFirst({
        where: {
          borrower_id: dbRequest.borrower_id,
          ht_id: dbRequest.ht_id,
          status: 'BORROWED'
        }
      })

      if (!activeTransaction) {
        return createErrorResponse('No active loan transaction found for this request.', 400)
      }

      const finalCondition = returnCondition || dbRequest.ht_item.condition

      // Execute atomic transaction
      const [approvedRequest] = await prisma.$transaction([
        prisma.transactionRequest.update({
          where: { id },
          data: {
            status: 'APPROVED',
            operator_id: operatorId,
            note: note || 'Disetujui oleh Admin'
          }
        }),
        prisma.transaction.update({
          where: { id: activeTransaction.id },
          data: {
            status: 'RETURNED',
            return_time: new Date()
          }
        }),
        prisma.hT_Item.update({
          where: { id: dbRequest.ht_id },
          data: {
            status: 'AVAILABLE',
            condition: finalCondition
          }
        })
      ])

      return createSuccessResponse(approvedRequest, 'Return request approved successfully.')
    }
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to approve request.')
  }
}
