import { prisma } from '@/lib/prisma'
import { createServerErrorResponse, createSuccessResponse, requireAuthenticatedSession } from '@/utils/api-route'

import type { Borrower } from '@/types/borrower'
import type { Borrower as PrismaBorrower } from '../../../../../generated/prisma/client'

export const dynamic = 'force-dynamic'

function mapBorrower(b: PrismaBorrower): Borrower {
  return {
    id: b.id,
    borrowerCode: b.borrower_code,
    barcode: b.barcode,
    fullName: b.full_name,
    department: b.department,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString()
  }
}

export async function GET(): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  try {
    const borrowers = await prisma.borrower.findMany({
      where: {
        transactions: {
          none: {
            status: 'BORROWED'
          }
        }
      },
      orderBy: {
        full_name: 'asc'
      }
    })

    return createSuccessResponse(borrowers.map(mapBorrower), 'Available borrowers loaded successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load available borrowers.')
  }
}
