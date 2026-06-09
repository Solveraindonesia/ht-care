import type { ApiResponse } from '@/types/api'
import type { CreateRequestPayload, ProcessRequestPayload, TransactionRequest } from '@/types/request'
import { getServiceErrorMessage, unwrapApiResponse } from '@/utils/api-response'
import axios from 'axios'

export async function getRequests(status?: string): Promise<TransactionRequest[]> {
  try {
    const url = status ? `/api/requests?status=${encodeURIComponent(status)}` : '/api/requests'
    const response = await axios.get<ApiResponse<TransactionRequest[]>>(url)
    return unwrapApiResponse(response.data, 'Failed to load requests.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to load requests.'))
  }
}

export async function createBorrowRequest(payload: CreateRequestPayload): Promise<TransactionRequest> {
  try {
    const response = await axios.post<ApiResponse<TransactionRequest>>('/api/requests/borrow', payload)
    return unwrapApiResponse(response.data, 'Failed to submit borrow request.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to submit borrow request.'))
  }
}

export async function createReturnRequest(payload: CreateRequestPayload): Promise<TransactionRequest> {
  try {
    const response = await axios.post<ApiResponse<TransactionRequest>>('/api/requests/return', payload)
    return unwrapApiResponse(response.data, 'Failed to submit return request.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to submit return request.'))
  }
}

export async function approveRequest(id: string, payload: ProcessRequestPayload): Promise<TransactionRequest> {
  try {
    const response = await axios.post<ApiResponse<TransactionRequest>>(`/api/requests/${encodeURIComponent(id)}/approve`, payload)
    return unwrapApiResponse(response.data, 'Failed to approve request.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to approve request.'))
  }
}

export async function rejectRequest(id: string, payload: ProcessRequestPayload): Promise<TransactionRequest> {
  try {
    const response = await axios.post<ApiResponse<TransactionRequest>>(`/api/requests/${encodeURIComponent(id)}/reject`, payload)
    return unwrapApiResponse(response.data, 'Failed to reject request.')
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Failed to reject request.'))
  }
}
