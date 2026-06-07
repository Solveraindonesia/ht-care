import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateProfileSchema } from '@/schemas/settings.schema'
import { createErrorResponse, createServerErrorResponse, createSuccessResponse, createValidationErrorResponse } from '@/utils/api-route'
import { getServerSession } from 'next-auth'

export async function PUT(request: Request): Promise<Response> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return createErrorResponse('Unauthorized.', 401)
    }

    const body = await request.json()
    const result = updateProfileSchema.safeParse(body)

    if (!result.success) {
      return createValidationErrorResponse(result.error)
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: result.data.name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return createSuccessResponse(updatedUser, 'Profile updated successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to update profile.')
  }
}
