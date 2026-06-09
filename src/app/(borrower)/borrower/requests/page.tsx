'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRequests } from '@/hooks/use-requests'
import { format } from 'date-fns'
import { ClipboardList, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function BorrowerRequestsPage(): React.JSX.Element {
  const t = useTranslations('transaction.request')
  const { data: requests, isLoading, error } = useRequests()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            className="border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
            variant="outline"
          >
            {t('status.pending')}
          </Badge>
        )
      case 'APPROVED':
        return (
          <Badge
            className="border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300"
            variant="outline"
          >
            {t('status.approved')}
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300" variant="outline">
            {t('status.rejected')}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return type === 'BORROW' ? (
      <Badge className="border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300" variant="outline">
        {t('type.borrow')}
      </Badge>
    ) : (
      <Badge
        className="border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
        variant="outline"
      >
        {t('type.return')}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-2xl">
          <ClipboardList className="text-primary size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('borrowerTitle')}</h1>
          <p className="text-muted-foreground text-sm">{t('borrowerDescription')}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t('borrowerTitle')}</CardTitle>
          <CardDescription>{t('borrowerDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="font-semibold text-red-500">{t('feedback.loadError')}</p>
            </div>
          ) : requests && requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
                <Info className="text-muted-foreground size-7" />
              </div>
              <h3 className="text-lg font-semibold">{t('feedback.empty')}</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('table.time')}</TableHead>
                    <TableHead>{t('table.ht')}</TableHead>
                    <TableHead>{t('table.type')}</TableHead>
                    <TableHead>{t('table.status')}</TableHead>
                    <TableHead>{t('table.note')}</TableHead>
                    <TableHead>{t('table.operator')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs whitespace-nowrap">{format(new Date(req.createdAt), 'dd MMM yyyy, HH:mm')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-primary font-mono font-semibold">{req.htItem.htCode}</span>
                          <span className="text-muted-foreground text-xs">{req.htItem.brandType}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(req.type)}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={req.note || ''}>
                        {req.note || '-'}
                      </TableCell>
                      <TableCell>{req.operatorName || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
