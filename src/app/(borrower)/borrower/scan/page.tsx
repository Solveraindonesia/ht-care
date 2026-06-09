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
import { CheckCircle2, Info, Loader2, Radio, ScanLine } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function BorrowerScanPage(): React.JSX.Element {
  const t = useTranslations('transaction')
  const tHt = useTranslations('ht')
  const [scannedCode, setScannedCode] = useState('')

  // 1. Fetch transaction history to check active loan
  const { data: history, isLoading: isHistoryLoading } = useTransactionHistory()
  const activeLoan = history?.find((t) => t.status === 'BORROWED')

  // 2. Fetch scanned HT details
  const { data: htItem, isLoading: isHtLoading, error: htError } = useHtByCode(scannedCode)

  // 3. Fetch requests to check if borrower already has a PENDING request
  const { data: requests, isLoading: isRequestsLoading } = useRequests('PENDING')
  const hasPendingRequest = requests && requests.length > 0

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

  const handleSubmitRequest = async () => {
    if (!htItem) return

    try {
      if (!activeLoan) {
        // Submit Borrow Request
        if (htItem.status !== 'AVAILABLE') {
          toast.error(t('borrow.errorAlreadyBorrowed'))
          return
        }
        await borrowRequestMutation.mutateAsync({ htCode: htItem.htCode })
        toast.success(t('request.successBorrow'))
      } else {
        // Submit Return Request
        if (htItem.htCode !== activeLoan.htCode) {
          toast.error(
            t('request.activeLoan') === 'Your Active Loan'
              ? 'Scanned HT code does not match your active loan.'
              : 'HT yang di-scan tidak sesuai dengan pinjaman aktif Anda.'
          )
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

  const isLoading = isHistoryLoading || isRequestsLoading
  const isActionPending = borrowRequestMutation.isPending || returnRequestMutation.isPending

  // Decide what to render in results panel
  const hasResult = htItem !== undefined

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
      ) : hasPendingRequest ? (
        /* Alert if user already has a pending request */
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/10">
          <CardHeader className="flex flex-row items-center gap-3">
            <Info className="size-6 shrink-0 text-amber-600" />
            <div>
              <CardTitle className="text-lg text-amber-800 dark:text-amber-400">{t('request.alreadyPending')}</CardTitle>
              <CardDescription className="text-amber-700/80 dark:text-amber-500/80">
                {t('request.successBorrow').includes('persetujuan')
                  ? 'Anda hanya dapat memiliki satu pengajuan aktif yang menunggu persetujuan Admin pada satu waktu.'
                  : 'You can only have one pending request at a time. Please wait for the administrator to approve or reject your current request.'}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5">
          {/* Left Panel - Scanner */}
          <div className="flex flex-col gap-4 xl:col-span-2">
            {activeLoan && (
              /* Display Active Loan info */
              <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-blue-900 dark:text-blue-400">{t('request.activeLoan')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800 dark:text-blue-300">
                  <div className="flex flex-col gap-1">
                    <p>
                      <strong>{t('detail.htCode')}:</strong> <span className="font-mono">{activeLoan.htCode}</span>
                    </p>
                    <p>
                      <strong>{t('detail.brandType')}:</strong> {activeLoan.brandType}
                    </p>
                    <p>
                      <strong>{t('detail.borrowTime')}:</strong> {format(new Date(activeLoan.borrowTime), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <ScanInput onCodeSubmit={handleCodeSubmit} isLoading={isHtLoading} />

            {/* Scan Tips */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col gap-3 py-4">
                <h3 className="text-sm font-semibold">{t('tips.title')}</h3>
                <ul className="text-muted-foreground space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                    {!activeLoan ? t('tips.tip1') : t('tips.returnTip') || 'Scan HT yang ingin Anda kembalikan.'}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                    {t('tips.tip2')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="xl:col-span-3">
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
                          {htItem.status === 'AVAILABLE' ? tHt('status.available') : tHt('status.borrowed')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submission button */}
                <Button onClick={handleSubmitRequest} disabled={isActionPending} className="w-full" size="lg">
                  {isActionPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {!activeLoan ? t('request.submitBorrow') : t('request.submitReturn')}
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
                  <h3 className="text-lg font-semibold">{!activeLoan ? t('empty.borrowTitle') : t('empty.returnTitle')}</h3>
                  <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                    {!activeLoan ? t('empty.borrowDescription') : t('empty.returnDescription')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
