'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Camera, CameraOff, Focus } from 'lucide-react'

interface BarcodeScannerProps {
  onScanSuccess: (code: string) => void
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps): React.JSX.Element {
  const t = useTranslations('transaction.scanner')
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<unknown>(null)

  const stopScanner = useCallback(async (): Promise<void> => {
    try {
      const scanner = html5QrCodeRef.current as { stop: () => Promise<void>; clear: () => void } | null

      if (scanner) {
        await scanner.stop()
        scanner.clear()
      }
    } catch {
      // Scanner may already be stopped
    } finally {
      html5QrCodeRef.current = null
      setIsScanning(false)
    }
  }, [])

  const startScanner = useCallback(async (): Promise<void> => {
    setError(null)

    if (!scannerRef.current) {
      return
    }

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scannerId = 'ht-barcode-scanner'

      scannerRef.current.id = scannerId

      const html5QrCode = new Html5Qrcode(scannerId)
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText: string) => {
          onScanSuccess(decodedText)
          void stopScanner()
        },
        () => {
          // QR code scan failure (noise) — ignore
        }
      )

      setIsScanning(true)
    } catch {
      setError(t('permissionDenied'))
      setIsScanning(false)
    }
  }, [onScanSuccess, stopScanner, t])

  useEffect(() => {
    return () => {
      void stopScanner()
    }
  }, [stopScanner])

  return (
    <div className="flex flex-col gap-3">
      {/* Viewfinder */}
      <div className="relative">
        <div ref={scannerRef} className="bg-muted/40 border-border relative min-h-[220px] overflow-hidden rounded-xl border" />

        {/* Overlay when not scanning */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl">
            <div className="bg-muted/80 flex size-14 items-center justify-center rounded-full backdrop-blur-sm">
              <Focus className="text-muted-foreground size-6" />
            </div>
            <p className="text-muted-foreground text-xs font-medium">{t('viewfinderHint')}</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        variant={isScanning ? 'destructive' : 'default'}
        size="lg"
        onClick={isScanning ? () => void stopScanner() : () => void startScanner()}
        className="w-full"
      >
        {isScanning ? (
          <>
            <CameraOff className="size-4" />
            {t('stopCamera')}
          </>
        ) : (
          <>
            <Camera className="size-4" />
            {t('startCamera')}
          </>
        )}
      </Button>
    </div>
  )
}
