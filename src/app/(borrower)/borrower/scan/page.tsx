'use client'

import { HtConditionBadge } from '@/components/shared/status-badge'
import { ScanInput } from '@/components/transactions/scan-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateBorrowRequest, useCreateReturnRequest, useRequests } from '@/hooks/use-requests'
import { useHtByCode, useTransactionHistory } from '@/hooks/use-transactions'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle2, Loader2, Radio, ScanLine } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function BorrowerScanPage(): React.JSX.Element {
  const t = useTranslations('transaction')
  const tHt = useTranslations('ht')
  const [scannedCode, setScannedCode] = useState('')

  // 1. Fetch transaction history to check active loans
  const { data: history, isLoading: isHistoryLoading } = useTransactionHistory()
  const activeLoans = history?.filter((t) => t.status === 'BORROWED') || []

  // 2. Fetch scanned HT details
  const { data: htItem, isLoading: isHtLoading, error: htError } = useHtByCode(scannedCode)

  // 3. Fetch pending requests
  const { data: requests, isLoading: isRequestsLoading } = useRequests('PENDING')

  // Mutations
  const borrowRequestMutation = useCreateBorrowRequest()
  const returnRequestMutation = useCreateReturnRequest()

  const handleCodeSubmit = useCallback((code: string): void => {
    setScannedCode(code)
  }, [])

  const handleReset = useCallback((): void => {
    setScannedCode('')
  }, [])

  const prevErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (htError && scannedCode.length > 0 && prevErrorRef.current !== htError.message) {
      toast.error(htError.message)
      setScannedCode('')
    }
    prevErrorRef.current = htError?.message ?? null
  }, [htError, scannedCode])

  const isLoading = isHistoryLoading || isRequestsLoading
  const isActionPending = borrowRequestMutation.isPending || returnRequestMutation.isPending
  const hasResult = htItem !== undefined

  // Determine if scanned HT is already borrowed by the logged-in borrower
  const myActiveLoan = activeLoans.find((loan) => loan.htCode === htItem?.htCode)
  const isBorrowedByMe = !!myActiveLoan

  // Determine if there is already a pending request for the scanned HT unit
  const scannedHtPendingRequest = requests?.find((r) => r.htItem.htCode === htItem?.htCode)
  const hasPendingRequestForScannedHt = !!scannedHtPendingRequest

  const handleSubmitRequest = async () => {
    if (!htItem) return

    try {
      if (!isBorrowedByMe) {
        // --- Borrow Request Flow ---
        if (htItem.status !== 'AVAILABLE') {
          toast.error(t('borrow.errorAlreadyBorrowed'))
          return
        }
        if (hasPendingRequestForScannedHt) {
          toast.error(t('request.alreadyPending'))
          return
        }
        await borrowRequestMutation.mutateAsync({ htCode: htItem.htCode })
        toast.success(t('request.successBorrow'))
      } else {
        // --- Return Request Flow ---
        if (hasPendingRequestForScannedHt) {
          toast.error(t('request.alreadyPending'))
          return
        }
        await returnRequestMutation.mutateAsync({ htCode: htItem.htCode })
        toast.success(t('request.successReturn'))
      }
      handleReset()
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to submit request'
      toast.error(errMsg)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-2xl">
          <ScanLine className="text-primary size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('request.scanTitle')}</h1>
          <p className="text-muted-foreground text-sm">{t('request.scanDescription')}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <Skeleton className="h-60 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-60 rounded-2xl lg:col-span-3" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5">
          {/* Left Panel - Active Loans list and Scanner */}
          <div className="flex flex-col gap-4 xl:col-span-2">
            <ScanInput onCodeSubmit={handleCodeSubmit} isLoading={isHtLoading} />
            {/* Scan Tips */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col gap-3 py-4">
                <h3 className="text-sm font-semibold">{t('tips.title')}</h3>
                <ul className="text-muted-foreground space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                    {t('tips.tip1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                    {t('tips.tip2')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results & Submissions */}
          <div className="xl:col-span-3">
            {activeLoans.length > 0 ? (
              /* Display list of all active loans */
              <Card className="mb-4 border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-blue-900 dark:text-blue-400">
                    {t('request.activeLoan').includes('Pinjaman') ? 'Pinjaman Aktif Anda' : 'Your Active Loans'} ({activeLoans.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex max-h-[280px] flex-col gap-3 overflow-y-auto text-sm text-blue-800 dark:text-blue-300">
                  {activeLoans.map((loan) => (
                    <div key={loan.id} className="flex flex-col border-b border-blue-200/50 pb-2 last:border-0 last:pb-0 dark:border-blue-800/30">
                      <p className="flex justify-between">
                        <span>
                          <strong>{t('detail.htCode')}:</strong> <span className="font-mono font-semibold">{loan.htCode}</span>
                        </span>
                        <Badge variant="outline" className="bg-blue-100/50 text-xs dark:bg-blue-900/20">
                          {loan.brandType}
                        </Badge>
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        <strong>{t('detail.borrowTime')}:</strong> {format(new Date(loan.borrowTime), 'dd MMM yyyy, HH:mm')}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-4 border-dashed">
                <CardContent className="text-muted-foreground py-6 text-center text-sm">
                  {t('request.noActiveLoan') || 'Anda tidak memiliki pinjaman aktif saat ini.'}
                </CardContent>
              </Card>
            )}

            {isHtLoading && (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            )}

            {/* HT details available */}
            {!isHtLoading && hasResult && (
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('detail.htInfo')}</CardTitle>
                    <CardDescription>{t('detail.htInfoDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs">{t('detail.htCode')}</p>
                        <p className="text-primary font-mono font-semibold">{htItem.htCode}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">{t('detail.brandType')}</p>
                        <p className="font-medium">{htItem.brandType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">{t('detail.condition')}</p>
                        <HtConditionBadge condition={htItem.condition} label={tHt(`condition.${htItem.condition.toLowerCase()}`)} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">{t('detail.status')}</p>
                        <Badge variant="outline" className="font-medium">
                          {isBorrowedByMe
                            ? t('request.activeLoan').includes('Pinjaman')
                              ? 'Dipinjam oleh Anda'
                              : 'Borrowed by You'
                            : htItem.status === 'AVAILABLE'
                              ? tHt('status.available')
                              : tHt('status.borrowed')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending request warning for this scanned HT unit */}
                {hasPendingRequestForScannedHt && (
                  <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/10">
                    <CardContent className="flex items-center gap-3 py-3 text-sm text-amber-800 dark:text-amber-400">
                      <AlertCircle className="size-5 shrink-0" />
                      <p>
                        <strong>{t('request.alreadyPending')}</strong> &mdash;{' '}
                        {scannedHtPendingRequest?.type === 'BORROW'
                          ? 'Pengajuan pinjam untuk unit ini sedang menunggu persetujuan.'
                          : 'Pengajuan kembali untuk unit ini sedang menunggu persetujuan.'}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Submission button */}
                <Button
                  onClick={handleSubmitRequest}
                  disabled={isActionPending || hasPendingRequestForScannedHt || (htItem.status !== 'AVAILABLE' && !isBorrowedByMe)}
                  className="w-full"
                  size="lg"
                >
                  {isActionPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {isBorrowedByMe ? t('request.submitReturn') : t('request.submitBorrow')}
                </Button>
              </div>
            )}

            {/* Empty scan state */}
            {!isHtLoading && !hasResult && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
                    <Radio className="text-muted-foreground size-7" />
                  </div>
                  <h3 className="text-lg font-semibold">{t('empty.borrowTitle')}</h3>
                  <p className="text-muted-foreground mt-1 max-w-sm text-sm">{t('request.scanDescription')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
