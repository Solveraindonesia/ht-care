import type { ApiResponse } from '@/types/api'
import type { HtCreatePayload, HtItem, HtUpdatePayload } from '@/types/ht'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

const HT_API_URL = '/api/ht'

export async function getHtItems(): Promise<HtItem[]> {
  try {
    const response = await axios.get<ApiResponse<HtItem[]>>(HT_API_URL)
    return unwrapApiResponse(response.data, 'Failed to load HT items.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load HT items.'))
  }
}

export async function createHtItem(payload: HtCreatePayload): Promise<HtItem> {
  try {
    const response = await axios.post<ApiResponse<HtItem>>(HT_API_URL, payload)
    return unwrapApiResponse(response.data, 'Failed to create HT item.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to create HT item.'))
  }
}

export async function updateHtItem(payload: HtUpdatePayload): Promise<HtItem> {
  try {
    const response = await axios.put<ApiResponse<HtItem>>(HT_API_URL, payload)
    return unwrapApiResponse(response.data, 'Failed to update HT item.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to update HT item.'))
  }
}

export async function deleteHtItem(id: string): Promise<HtItem> {
  try {
    const response = await axios.delete<ApiResponse<HtItem>>(HT_API_URL, {
      data: { id }
    })
    return unwrapApiResponse(response.data, 'Failed to delete HT item.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to delete HT item.'))
  }
}
