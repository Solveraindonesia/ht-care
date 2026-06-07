import type { UpdatePasswordPayload, UpdateProfilePayload } from '@/schemas/settings.schema'
import { updatePassword, updateProfile } from '@/services/settings.service'
import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useUpdateProfile(): UseMutationResult<
  { id: string; name: string | null; email: string | null; role: string },
  Error,
  UpdateProfilePayload
> {
  const { update } = useSession()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      // Invalidate query or update client-side session token
      await update({ name: data.name })
    }
  })
}

export function useUpdatePassword(): UseMutationResult<null, Error, UpdatePasswordPayload> {
  return useMutation({
    mutationFn: updatePassword
  })
}
