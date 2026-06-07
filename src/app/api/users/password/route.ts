import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updatePasswordSchema } from '@/schemas/settings.schema'
import { createErrorResponse, createServerErrorResponse, createSuccessResponse, createValidationErrorResponse } from '@/utils/api-route'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'

export async function PUT(request: Request): Promise<Response> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return createErrorResponse('Unauthorized.', 401)
    }

    const body = await request.json()
    const result = updatePasswordSchema.safeParse(body)

    if (!result.success) {
      return createValidationErrorResponse(result.error)
    }

    if (session.user.role === 'BORROWER') {
      const borrower = await prisma.borrower.findUnique({
        where: { id: session.user.id }
      })

      if (!borrower || !borrower.password) {
        return createErrorResponse('Borrower not found or password login not supported.', 404)
      }

      // Validate current password
      const isPasswordValid = await bcrypt.compare(result.data.currentPassword, borrower.password)
      if (!isPasswordValid) {
        return createErrorResponse('Incorrect current password.', 400)
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(result.data.newPassword, 10)

      // Update password in DB
      await prisma.borrower.update({
        where: { id: session.user.id },
        data: { password: hashedNewPassword }
      })

      return createSuccessResponse(null, 'Password updated successfully.')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !user.password) {
      return createErrorResponse('User not found or password login not supported.', 404)
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(result.data.currentPassword, user.password)
    if (!isPasswordValid) {
      return createErrorResponse('Incorrect current password.', 400)
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(result.data.newPassword, 10)

    // Update password in DB
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return createSuccessResponse(null, 'Password updated successfully.')
  } catch (error) {
    return createServerErrorResponse(error, 'Failed to update password.')
  }
}
