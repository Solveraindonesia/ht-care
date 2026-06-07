import { prisma } from '@/lib/prisma'
import { createErrorResponse, createServerErrorResponse, createSuccessResponse, requireAuthenticatedSession } from '@/utils/api-route'

import type { HtItem } from '@/types/ht'
import type { HT_Item as PrismaHtItem } from '../../../../../../generated/prisma/client'

export const dynamic = 'force-dynamic'

function mapHtItem(item: PrismaHtItem): HtItem {
  return {
    id: item.id,
    htCode: item.ht_code,
    barcode: item.barcode,
    brandType: item.brand_type,
    condition: item.condition,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }): Promise<Response> {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  const { code } = await params

  try {
    const htItem = await prisma.hT_Item.findFirst({
      where: {
        OR: [{ ht_code: code }, { barcode: code }]
      }
    })

    if (!htItem) {
      return createErrorResponse('HT item not found.', 404)
    }

    return createSuccessResponse(mapHtItem(htItem), 'HT item loaded successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load HT item.')
  }
}
