import { prisma } from '@/lib/prisma'
import { htCreateSchema, htDeleteSchema, htUpdateSchema } from '@/schemas/ht.schema'
import {
  createErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  getPrismaErrorCode,
  requireAuthenticatedSession,
  requireMasterDataAccess
} from '@/utils/api-route'

import type { HtItem } from '@/types/ht'
import type { HT_Item as PrismaHtItem } from '../../../../generated/prisma/client'

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

function getResolvedBarcode(barcode: string | undefined, htCode: string): string {
  return barcode || htCode
}

function createHtPrismaErrorResponse(error: unknown) {
  const code = getPrismaErrorCode(error)

  if (code === 'P2002') {
    return createErrorResponse('HT code already exists.', 400)
  }

  if (code === 'P2025') {
    return createErrorResponse('HT item was not found.', 404)
  }

  if (code === 'P2003') {
    return createErrorResponse('HT item cannot be deleted because it is used by transactions.', 400)
  }

  return null
}

export async function GET() {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  try {
    const htItems = await prisma.hT_Item.findMany({
      orderBy: {
        ht_code: 'asc'
      }
    })

    return createSuccessResponse(htItems.map(mapHtItem), 'HT items loaded successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load HT items.')
  }
}

export async function POST(request: Request) {
  const authResponse = await requireMasterDataAccess()

  if (authResponse) {
    return authResponse
  }

  try {
    const payload: unknown = await request.json()
    const validation = htCreateSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const htItem = await prisma.hT_Item.create({
      data: {
        ht_code: validation.data.htCode,
        barcode: getResolvedBarcode(validation.data.barcode, validation.data.htCode),
        brand_type: validation.data.brandType,
        condition: validation.data.condition,
        status: validation.data.status
      }
    })

    return createSuccessResponse(mapHtItem(htItem), 'HT item created successfully.', 201)
  } catch (error) {
    const prismaErrorResponse = createHtPrismaErrorResponse(error)

    if (prismaErrorResponse) {
      return prismaErrorResponse
    }

    return createServerErrorResponse(error, 'Failed to create HT item.')
  }
}

export async function PUT(request: Request) {
  const authResponse = await requireMasterDataAccess()

  if (authResponse) {
    return authResponse
  }

  try {
    const payload: unknown = await request.json()
    const validation = htUpdateSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const htItem = await prisma.hT_Item.update({
      where: {
        id: validation.data.id
      },
      data: {
        ht_code: validation.data.htCode,
        barcode: getResolvedBarcode(validation.data.barcode, validation.data.htCode),
        brand_type: validation.data.brandType,
        condition: validation.data.condition,
        status: validation.data.status
      }
    })

    return createSuccessResponse(mapHtItem(htItem), 'HT item updated successfully.')
  } catch (error) {
    const prismaErrorResponse = createHtPrismaErrorResponse(error)

    if (prismaErrorResponse) {
      return prismaErrorResponse
    }

    return createServerErrorResponse(error, 'Failed to update HT item.')
  }
}

export async function DELETE(request: Request) {
  const authResponse = await requireMasterDataAccess()

  if (authResponse) {
    return authResponse
  }

  try {
    const payload: unknown = await request.json()
    const validation = htDeleteSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const htItem = await prisma.hT_Item.delete({
      where: {
        id: validation.data.id
      }
    })

    return createSuccessResponse(mapHtItem(htItem), 'HT item deleted successfully.')
  } catch (error) {
    const prismaErrorResponse = createHtPrismaErrorResponse(error)

    if (prismaErrorResponse) {
      return prismaErrorResponse
    }

    return createServerErrorResponse(error, 'Failed to delete HT item.')
  }
}
