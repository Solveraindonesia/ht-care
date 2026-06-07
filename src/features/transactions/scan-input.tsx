'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BarcodeScanner } from '@/features/transactions/barcode-scanner'
import { cn } from '@/lib/utils'
import { Camera, Keyboard, Loader2, Search } from 'lucide-react'

type InputMode = 'camera' | 'manual'

interface ScanInputProps {
  onCodeSubmit: (code: string) => void
  isLoading?: boolean
}

export function ScanInput({ onCodeSubmit, isLoading = false }: ScanInputProps): React.JSX.Element {
  const t = useTranslations('transaction.scanner')
  const [mode, setMode] = useState<InputMode>('camera')
  const [manualCode, setManualCode] = useState('')

  function handleManualSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const trimmed = manualCode.trim()

    if (trimmed.length > 0) {
      onCodeSubmit(trimmed)
      setManualCode('')
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Mode Toggle */}
        <div className="bg-muted flex rounded-xl p-1">
          <button
            type="button"
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              mode === 'camera' ? 'bg-background text-foreground custom-shadow' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMode('camera')}
          >
            <Camera className="size-4" />
            {t('camera')}
          </button>
          <button
            type="button"
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              mode === 'manual' ? 'bg-background text-foreground custom-shadow' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMode('manual')}
          >
            <Keyboard className="size-4" />
            {t('manual')}
          </button>
        </div>

        {/* Scanner / Manual Input */}
        {mode === 'camera' ? (
          <BarcodeScanner onScanSuccess={onCodeSubmit} />
        ) : (
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t('placeholder')}
                disabled={isLoading}
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button type="submit" size="lg" disabled={isLoading || manualCode.trim().length === 0} className="w-full">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              {t('submit')}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
