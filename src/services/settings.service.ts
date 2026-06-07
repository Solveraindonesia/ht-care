import type { UpdatePasswordPayload, UpdateProfilePayload } from '@/schemas/settings.schema'
import type { ApiResponse } from '@/types/api'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

export async function updateProfile(payload: UpdateProfilePayload): Promise<{ id: string; name: string | null; email: string | null; role: string }> {
  try {
    const response = await axios.put<ApiResponse<{ id: string; name: string | null; email: string | null; role: string }>>(
      '/api/users/profile',
      payload
    )
    return unwrapApiResponse(response.data, 'Failed to update profile.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to update profile.'))
  }
}

export async function updatePassword(payload: UpdatePasswordPayload): Promise<null> {
  try {
    const response = await axios.put<ApiResponse<null>>('/api/users/password', payload)
    return unwrapApiResponse(response.data, 'Failed to update password.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to update password.'))
  }
}
