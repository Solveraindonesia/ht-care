import type { ApiResponse } from '@/types/api'
import type { Borrower, BorrowerCreatePayload, BorrowerUpdatePayload } from '@/types/borrower'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

const BORROWER_API_URL = '/api/borrowers'

export async function getBorrowers(): Promise<Borrower[]> {
  try {
    const response = await axios.get<ApiResponse<Borrower[]>>(BORROWER_API_URL)
    return unwrapApiResponse(response.data, 'Failed to load borrowers.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load borrowers.'))
  }
}

export async function createBorrower(payload: BorrowerCreatePayload): Promise<Borrower> {
  try {
    const response = await axios.post<ApiResponse<Borrower>>(BORROWER_API_URL, payload)
    return unwrapApiResponse(response.data, 'Failed to create borrower.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to create borrower.'))
  }
}

export async function updateBorrower(payload: BorrowerUpdatePayload): Promise<Borrower> {
  try {
    const response = await axios.put<ApiResponse<Borrower>>(BORROWER_API_URL, payload)
    return unwrapApiResponse(response.data, 'Failed to update borrower.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to update borrower.'))
  }
}

export async function deleteBorrower(id: string): Promise<Borrower> {
  try {
    const response = await axios.delete<ApiResponse<Borrower>>(BORROWER_API_URL, {
      data: { id }
    })
    return unwrapApiResponse(response.data, 'Failed to delete borrower.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to delete borrower.'))
  }
}
