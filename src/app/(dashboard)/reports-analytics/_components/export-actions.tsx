'use client'

import { FileSpreadsheet, FileText, Printer } from 'lucide-react'
import { useTranslations } from 'use-intl'

export function ExportActions(): React.JSX.Element {
  const t = useTranslations('report')

  const handlePrint = (): void => {
    window.print()
  }

  return (
    <div className="bg-surface-container-lowest border-surface-variant flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 shadow-sm md:flex-row">
      <div className="text-on-surface-variant text-sm font-medium">{t('analytics.exportTitle')}</div>
      <div className="flex w-full flex-wrap gap-3 md:w-auto">
        <button
          onClick={() => alert('PDF export coming soon')}
          className="bg-surface-container-low text-primary border-primary/20 hover:bg-primary-fixed flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-5 py-2 text-xs font-semibold transition-colors md:flex-none"
        >
          <FileText className="size-4" />
          {t('analytics.exportPdf')}
        </button>
        <button
          onClick={() => alert('Excel export coming soon')}
          className="bg-surface-container-low text-primary border-primary/20 hover:bg-primary-fixed flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-5 py-2 text-xs font-semibold transition-colors md:flex-none"
        >
          <FileSpreadsheet className="size-4" />
          {t('analytics.exportExcel')}
        </button>
        <button
          onClick={handlePrint}
          className="bg-primary text-on-primary hover:bg-primary/95 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold shadow-sm transition-colors md:flex-none"
        >
          <Printer className="size-4" />
          {t('analytics.printReport')}
        </button>
      </div>
    </div>
  )
}
