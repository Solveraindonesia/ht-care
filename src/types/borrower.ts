export interface Borrower {
  id: string
  borrowerCode: string
  barcode: string | null
  fullName: string
  department: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface BorrowerCreatePayload {
  borrowerCode: string
  barcode?: string
  fullName: string
  department: string
  email: string
  password?: string
}

export interface BorrowerUpdatePayload extends BorrowerCreatePayload {
  id: string
}
