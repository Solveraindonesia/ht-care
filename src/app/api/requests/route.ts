import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createServerErrorResponse, createSuccessResponse, requireAuthenticatedSession } from '@/utils/api-route'
import { getServerSession } from 'next-auth'

import type { TransactionRequest } from '@/types/request'
import type {
  Borrower as PrismaBorrower,
  HT_Item as PrismaHtItem,
  RequestStatus as PrismaRequestStatus,
  TransactionRequest as PrismaTransactionRequest,
  User as PrismaUser
} from '../../../../generated/prisma/client'
import { Prisma } from '../../../../generated/prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized.', 401)
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // e.g. PENDING, APPROVED, REJECTED

    const isBorrower = session.user.role === 'BORROWER'
    const userId = session.user.id

    const whereClause: Prisma.TransactionRequestWhereInput = {}

    if (isBorrower) {
      whereClause.borrower_id = userId
    }

    if (status) {
      whereClause.status = status as PrismaRequestStatus
    }

    const requests = await prisma.transactionRequest.findMany({
      where: whereClause,
      include: {
        ht_item: true,
        borrower: true,
        operator: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const mapped: TransactionRequest[] = requests.map(
      (
        req: PrismaTransactionRequest & {
          ht_item: PrismaHtItem
          borrower: PrismaBorrower
          operator: PrismaUser | null
        }
      ) => ({
        id: req.id,
        htId: req.ht_id,
        borrowerId: req.borrower_id,
        type: req.type,
        status: req.status,
        note: req.note,
        operatorId: req.operator_id,
        createdAt: req.createdAt.toISOString(),
        updatedAt: req.updatedAt.toISOString(),
        htItem: {
          id: req.ht_item.id,
          htCode: req.ht_item.ht_code,
          brandType: req.ht_item.brand_type,
          condition: req.ht_item.condition,
          status: req.ht_item.status
        },
        borrower: {
          id: req.borrower.id,
          borrowerCode: req.borrower.borrower_code,
          fullName: req.borrower.full_name,
          department: req.borrower.department
        },
        operatorName: req.operator?.name ?? null
      })
    )

    return createSuccessResponse(mapped, 'Requests retrieved successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to fetch requests.')
  }
}
