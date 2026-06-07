import { prisma } from '@/lib/prisma'
import { borrowerCreateSchema, borrowerDeleteSchema, borrowerUpdateSchema } from '@/schemas/borrower.schema'
import {
  createErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  getPrismaErrorCode,
  requireAuthenticatedSession,
  requireMasterDataAccess
} from '@/utils/api-route'
import bcrypt from 'bcryptjs'

import type { Borrower } from '@/types/borrower'
import type { Borrower as PrismaBorrower } from '../../../../generated/prisma/client'

export const dynamic = 'force-dynamic'

function mapBorrower(borrower: PrismaBorrower): Borrower {
  return {
    id: borrower.id,
    borrowerCode: borrower.borrower_code,
    barcode: borrower.barcode,
    fullName: borrower.full_name,
    department: borrower.department,
    email: borrower.email,
    createdAt: borrower.createdAt.toISOString(),
    updatedAt: borrower.updatedAt.toISOString()
  }
}

function getResolvedBarcode(barcode: string | undefined, borrowerCode: string): string {
  return barcode || borrowerCode
}

function createBorrowerPrismaErrorResponse(error: unknown) {
  const code = getPrismaErrorCode(error)

  if (code === 'P2002') {
    return createErrorResponse('Borrower code or email already exists.', 400)
  }

  if (code === 'P2025') {
    return createErrorResponse('Borrower was not found.', 404)
  }

  if (code === 'P2003') {
    return createErrorResponse('Borrower cannot be deleted because they are used by transactions.', 400)
  }

  return null
}

export async function GET() {
  const authResponse = await requireAuthenticatedSession()

  if (authResponse) {
    return authResponse
  }

  try {
    const borrowers = await prisma.borrower.findMany({
      orderBy: {
        borrower_code: 'asc'
      }
    })

    return createSuccessResponse(borrowers.map(mapBorrower), 'Borrowers loaded successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to load borrowers.')
  }
}

export async function POST(request: Request) {
  const authResponse = await requireMasterDataAccess()

  if (authResponse) {
    return authResponse
  }

  try {
    const payload: unknown = await request.json()
    const validation = borrowerCreateSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const hashedPassword = await bcrypt.hash(validation.data.password, 10)

    const borrower = await prisma.borrower.create({
      data: {
        borrower_code: validation.data.borrowerCode,
        barcode: getResolvedBarcode(validation.data.barcode as string | undefined, validation.data.borrowerCode),
        full_name: validation.data.fullName,
        department: validation.data.department,
        email: validation.data.email,
        password: hashedPassword
      }
    })

    return createSuccessResponse(mapBorrower(borrower), 'Borrower created successfully.', 201)
  } catch (error) {
    const prismaErrorResponse = createBorrowerPrismaErrorResponse(error)

    if (prismaErrorResponse) {
      return prismaErrorResponse
    }

    return createServerErrorResponse(error, 'Failed to create borrower.')
  }
}

export async function PUT(request: Request) {
  const authResponse = await requireMasterDataAccess()

  if (authResponse) {
    return authResponse
  }

  try {
    const payload: unknown = await request.json()
    const validation = borrowerUpdateSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const updateData: {
      borrower_code: string
      barcode: string
      full_name: string
      department: string
      email: string
      password?: string
    } = {
      borrower_code: validation.data.borrowerCode,
      barcode: getResolvedBarcode(validation.data.barcode as string | undefined, validation.data.borrowerCode),
      full_name: validation.data.fullName,
      department: validation.data.department,
      email: validation.data.email
    }

    if (validation.data.password && validation.data.password.trim().length > 0) {
      updateData.password = await bcrypt.hash(validation.data.password, 10)
    }

    const borrower = await prisma.borrower.update({
      where: {
        id: validation.data.id
      },
      data: updateData
    })

    return createSuccessResponse(mapBorrower(borrower), 'Borrower updated successfully.')
  } catch (error) {
    const prismaErrorResponse = createBorrowerPrismaErrorResponse(error)

    if (prismaErrorResponse) {
      return prismaErrorResponse
    }

    return createServerErrorResponse(error, 'Failed to update borrower.')
  }
}

export async function DELETE(request: Request) {
  const authResponse = await requireMasterDataAccess()

  if (authResponse) {
    return authResponse
  }

  try {
    const payload: unknown = await request.json()
    const validation = borrowerDeleteSchema.safeParse(payload)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const borrower = await prisma.borrower.delete({
      where: {
        id: validation.data.id
      }
    })

    return createSuccessResponse(mapBorrower(borrower), 'Borrower deleted successfully.')
  } catch (error) {
    const prismaErrorResponse = createBorrowerPrismaErrorResponse(error)

    if (prismaErrorResponse) {
      return prismaErrorResponse
    }

    return createServerErrorResponse(error, 'Failed to delete borrower.')
  }
}
