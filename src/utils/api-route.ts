import { authOptions } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

const INTERNAL_ERROR_MESSAGE = 'Internal server error.'

export function createApiResponse<T>(payload: ApiResponse<T>, status: number): NextResponse<ApiResponse<T>> {
  return NextResponse.json(payload, { status })
}

export function createSuccessResponse<T>(data: T, message: string, status = 200): NextResponse<ApiResponse<T>> {
  return createApiResponse(
    {
      success: true,
      data,
      message
    },
    status
  )
}

export function createErrorResponse(message: string, status: number): NextResponse<ApiResponse<null>> {
  return createApiResponse(
    {
      success: false,
      data: null,
      message
    },
    status
  )
}

export function createValidationErrorResponse(error: ZodError): NextResponse<ApiResponse<null>> {
  return createErrorResponse(error.issues[0]?.message || 'Invalid request payload.', 400)
}

export function createServerErrorResponse(error: unknown, context: string): NextResponse<ApiResponse<null>> {
  console.error(context, error)

  return createErrorResponse(INTERNAL_ERROR_MESSAGE, 500)
}

export async function requireAuthenticatedSession(): Promise<NextResponse<ApiResponse<null>> | null> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return createErrorResponse('Unauthorized.', 401)
  }

  return null
}

export async function requireMasterDataAccess(): Promise<NextResponse<ApiResponse<null>> | null> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return createErrorResponse('Unauthorized.', 401)
  }

  if (!['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
    return createErrorResponse('Forbidden.', 403)
  }

  return null
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function getPrismaErrorCode(error: unknown): string | null {
  if (!isRecord(error)) {
    return null
  }

  const code = error.code
  return typeof code === 'string' ? code : null
}
