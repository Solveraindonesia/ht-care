'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BorrowForm } from '@/features/transactions/borrow-form'
import { ScanInput } from '@/features/transactions/scan-input'
import { useHtByCode } from '@/hooks/use-transactions'
import { CheckCircle2, Radio, ScanLine } from 'lucide-react'
import { toast } from 'sonner'

export default function ScanPinjamPage(): React.JSX.Element {
  const t = useTranslations('transaction')
  const [scannedCode, setScannedCode] = useState('')

  const { data: htItem, isLoading, error } = useHtByCode(scannedCode)

  const handleCodeSubmit = useCallback((code: string): void => {
    setScannedCode(code)
  }, [])

  const handleReset = useCallback((): void => {
    setScannedCode('')
  }, [])

  const prevHtStatusRef = useRef<string | null>(null)
  const prevErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (htItem && htItem.status === 'BORROWED' && prevHtStatusRef.current !== 'BORROWED') {
      toast.error(t('borrow.errorAlreadyBorrowed'))
      setScannedCode('')
    }

    prevHtStatusRef.current = htItem?.status ?? null
  }, [htItem, t])

  useEffect(() => {
    if (error && scannedCode.length > 0 && prevErrorRef.current !== error.message) {
      toast.error(error.message)
      setScannedCode('')
    }

    prevErrorRef.current = error?.message ?? null
  }, [error, scannedCode])

  const hasResult = htItem && htItem.status === 'AVAILABLE'

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-2xl">
          <ScanLine className="text-primary size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('borrow.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('borrow.description')}</p>
        </div>
      </div>

      {/* Split Panel Layout */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5">
        {/* Left Panel — Scanner */}
        <div className="flex flex-col gap-4 xl:col-span-2">
          <ScanInput onCodeSubmit={handleCodeSubmit} isLoading={isLoading} />

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
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                  {t('tips.tip3')}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel — Results */}
        <div className="xl:col-span-3">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </div>
          )}

          {/* HT Available → Show Borrow Form */}
          {hasResult && <BorrowForm htItem={htItem} onSuccess={handleReset} />}

          {/* Empty State */}
          {!isLoading && !hasResult && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
                  <Radio className="text-muted-foreground size-7" />
                </div>
                <h3 className="text-lg font-semibold">{t('empty.borrowTitle')}</h3>
                <p className="text-muted-foreground mt-1 max-w-sm text-sm">{t('empty.borrowDescription')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
