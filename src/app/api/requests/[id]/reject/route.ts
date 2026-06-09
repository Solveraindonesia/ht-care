import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rejectRequestSchema } from '@/schemas/request.schema'
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
    return createErrorResponse('Forbidden. Only operators or admins can reject requests.', 403)
  }

  const operatorId = session.user.id
  const { id } = params

  try {
    const payload: unknown = await request.json()
    const validation = rejectRequestSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { note } = validation.data

    // 1. Find the request
    const dbRequest = await prisma.transactionRequest.findUnique({
      where: { id }
    })

    if (!dbRequest) {
      return createErrorResponse('Request not found.', 404)
    }

    if (dbRequest.status !== 'PENDING') {
      return createErrorResponse('This request has already been processed.', 400)
    }

    // 2. Reject the request
    const rejectedRequest = await prisma.transactionRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        operator_id: operatorId,
        note
      }
    })

    return createSuccessResponse(rejectedRequest, 'Request rejected successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to reject request.')
  }
}
