'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, Edit2, Plus, QrCode, ScanLine, Search, Settings, Smartphone, Trash2 } from 'lucide-react'

import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{t('title')}</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {/* Stat Card 1 */}
        <Card className="custom-shadow bg-card border-l-primary-container overflow-hidden border-0 border-l-4 transition-all hover:shadow-md">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-medium">{t('totalHt')}</p>
              <p className="text-foreground text-3xl font-bold">142</p>
            </div>
            <div className="bg-primary-fixed flex h-12 w-12 items-center justify-center rounded-xl dark:bg-blue-900/40">
              <Smartphone className="h-6 w-6 text-[#00236f] dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>

        {/* Stat Card 2 */}
        <Card className="custom-shadow bg-card overflow-hidden border-0 border-l-4 border-l-green-500 transition-all hover:shadow-md">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-medium">{t('available')}</p>
              <p className="text-foreground text-3xl font-bold">98</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* Stat Card 3 */}
        <Card className="custom-shadow bg-card overflow-hidden border-0 border-l-4 border-l-orange-400 transition-all hover:shadow-md">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-medium">{t('borrowed')}</p>
              <p className="text-foreground text-3xl font-bold">36</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <ScanLine className="h-6 w-6 text-orange-500 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        {/* Stat Card 4 */}
        <Card className="custom-shadow border-l-destructive bg-card overflow-hidden border-0 border-l-4 transition-all hover:shadow-md">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-medium">{t('broken')}</p>
              <p className="text-foreground text-3xl font-bold">8</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <Settings className="text-destructive h-6 w-6 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Action 1 */}
        <Card className="custom-shadow bg-card flex flex-col items-center gap-6 border-0 p-6 sm:flex-row">
          <div className="flex w-full flex-1 flex-col gap-4">
            <div>
              <h4 className="text-foreground flex items-center gap-2 text-xl font-bold">
                <ScanLine className="text-primary-container dark:text-blue-400" />
                Scan QR Peminjaman
              </h4>
              <p className="text-muted-foreground mt-1 text-sm">Arahkan kamera ke QR Code di unit HT untuk proses peminjaman cepat.</p>
            </div>
            <Button className="bg-primary-container hover:bg-primary w-max rounded-xl text-white">Minta Izin Kamera</Button>
            <div className="mt-2 flex w-full items-center gap-3">
              <span className="text-muted-foreground text-sm whitespace-nowrap">atau manual ID:</span>
              <Input className="h-10 flex-1 rounded-xl font-mono" placeholder="HT-..." />
              <Button variant="secondary" className="h-10 rounded-xl px-4">
                Submit
              </Button>
            </div>
          </div>
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <QrCode className="h-12 w-12 text-blue-300 dark:text-blue-700" />
          </div>
        </Card>

        {/* Action 2 */}
        <Card className="custom-shadow bg-card flex flex-col items-center gap-6 border-0 p-6 sm:flex-row">
          <div className="flex w-full flex-1 flex-col gap-4">
            <div>
              <h4 className="text-foreground flex items-center gap-2 text-xl font-bold">
                <ScanLine className="text-green-600 dark:text-green-400" />
                Scan QR Pengembalian
              </h4>
              <p className="text-muted-foreground mt-1 text-sm">Arahkan kamera ke QR Code untuk mengembalikan unit ke gudang.</p>
            </div>
            <Button className="w-max rounded-xl bg-green-600 text-white hover:bg-green-700">Minta Izin Kamera</Button>
            <div className="mt-2 flex w-full items-center gap-3">
              <span className="text-muted-foreground text-sm whitespace-nowrap">atau manual ID:</span>
              <Input className="h-10 flex-1 rounded-xl font-mono" placeholder="HT-..." />
              <Button variant="secondary" className="h-10 rounded-xl px-4">
                Submit
              </Button>
            </div>
          </div>
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <QrCode className="h-12 w-12 text-green-300 dark:text-green-700" />
          </div>
        </Card>
      </div>

      {/* Data Table Section */}
      <Card className="custom-shadow flex flex-col overflow-hidden border-0">
        <div className="border-border/50 flex flex-col items-start justify-between gap-4 border-b p-6 sm:flex-row sm:items-center">
          <h4 className="text-foreground text-xl font-bold">Inventaris HT</h4>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input className="h-10 w-full rounded-xl pl-9" placeholder="Cari ID atau Merk..." />
            </div>
            <Button className="bg-primary-container hover:bg-primary h-10 rounded-xl text-white">
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">{t('table.htId')}</TableHead>
                <TableHead className="font-semibold">{t('table.borrower')}</TableHead>
                <TableHead className="text-center font-semibold">{t('table.status')}</TableHead>
                <TableHead className="text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-primary-container font-mono font-medium dark:text-blue-400">HT-1042</TableCell>
                <TableCell>Motorola CP1300</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-100 font-medium text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300"
                  >
                    Tersedia
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary-container h-8 w-8">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/30 bg-muted/10 transition-colors">
                <TableCell className="text-primary-container font-mono font-medium dark:text-blue-400">HT-1043</TableCell>
                <TableCell>Baofeng UV-5R</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-100 font-medium text-orange-800 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                  >
                    Dipinjam
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary-container h-8 w-8">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
