import type { ApiResponse } from '@/types/api'
import axios from 'axios'

export function unwrapApiResponse<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (!response.success || response.data === null) {
    throw new Error(response.message || fallbackMessage)
  }

  return response.data
}

export function getServiceErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message || error.message || fallbackMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
