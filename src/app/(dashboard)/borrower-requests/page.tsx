'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useApproveRequest, useRejectRequest, useRequests } from '@/hooks/use-requests'
import { format } from 'date-fns'
import { Check, ClipboardList, Info, Loader2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import type { HtCondition } from '@/types/ht'
import type { TransactionRequest } from '@/types/request'

export default function BorrowerRequestsAdminPage(): React.JSX.Element {
  const t = useTranslations('transaction.request')
  const tHt = useTranslations('ht')
  const [activeTab, setActiveTab] = useState<string>('PENDING')

  // Dialog States
  const [selectedRequest, setSelectedRequest] = useState<TransactionRequest | null>(null)
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null)

  // Form States
  const [note, setNote] = useState<string>('')
  const [returnCondition, setReturnCondition] = useState<HtCondition>('GOOD')

  const { data: requests, isLoading, error } = useRequests(activeTab === 'ALL' ? undefined : activeTab)

  const approveMutation = useApproveRequest()
  const rejectMutation = useRejectRequest()

  const handleOpenDialog = (request: TransactionRequest, action: 'APPROVE' | 'REJECT') => {
    setSelectedRequest(request)
    setActionType(action)
    setNote('')
    setReturnCondition(request.htItem.condition)
  }

  const handleCloseDialog = () => {
    setSelectedRequest(null)
    setActionType(null)
    setNote('')
  }

  const handleProcessRequest = async () => {
    if (!selectedRequest || !actionType) return

    try {
      if (actionType === 'APPROVE') {
        const payload = selectedRequest.type === 'RETURN' ? { note, returnCondition } : { note }

        await approveMutation.mutateAsync({
          id: selectedRequest.id,
          payload
        })
        toast.success(t('feedback.approveSuccess'))
      } else {
        if (!note.trim()) {
          toast.error(t('rejectNotePlaceholder'))
          return
        }
        await rejectMutation.mutateAsync({
          id: selectedRequest.id,
          payload: { note }
        })
        toast.success(t('feedback.rejectSuccess'))
      }
      handleCloseDialog()
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error processing request'
      toast.error(errMsg)
    }
  }

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
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="PENDING" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full max-w-[600px] grid-cols-4">
          <TabsTrigger value="PENDING">{t('status.pending')}</TabsTrigger>
          <TabsTrigger value="APPROVED">{t('status.approved')}</TabsTrigger>
          <TabsTrigger value="REJECTED">{t('status.rejected')}</TabsTrigger>
          <TabsTrigger value="ALL">{t('feedback.approveSuccess').includes('berhasil') ? 'Semua' : 'All'}</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
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
                      <TableHead>{t('table.borrower')}</TableHead>
                      <TableHead>{t('table.ht')}</TableHead>
                      <TableHead>{t('table.type')}</TableHead>
                      <TableHead>{t('table.status')}</TableHead>
                      <TableHead>{t('table.note')}</TableHead>
                      <TableHead>{t('table.operator')}</TableHead>
                      {activeTab === 'PENDING' && <TableHead className="text-right">Aksi</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests?.map((req) => (
                      <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs whitespace-nowrap">{format(new Date(req.createdAt), 'dd MMM yyyy, HH:mm')}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{req.borrower.fullName}</span>
                            <span className="text-muted-foreground text-xs">
                              {req.borrower.borrowerCode} — {req.borrower.department}
                            </span>
                          </div>
                        </TableCell>
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
                        {activeTab === 'PENDING' && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                                onClick={() => handleOpenDialog(req, 'APPROVE')}
                              >
                                <Check className="mr-1 size-4" />
                                {t('approve')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                                onClick={() => handleOpenDialog(req, 'REJECT')}
                              >
                                <X className="mr-1 size-4" />
                                {t('reject')}
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Approve / Reject Dialog */}
      <Dialog open={selectedRequest !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionType === 'APPROVE' ? t('approveTitle') : t('rejectTitle')}</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <span>
                  {selectedRequest.borrower.fullName} ({selectedRequest.borrower.borrowerCode}) &mdash;{' '}
                  {selectedRequest.type === 'BORROW' ? t('type.borrow') : t('type.return')}{' '}
                  <strong className="text-primary font-mono">{selectedRequest.htItem.htCode}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* HT Condition Selection (Only for Approved Return Request) */}
            {actionType === 'APPROVE' && selectedRequest?.type === 'RETURN' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">{t('conditionLabel')}</label>
                <Select value={returnCondition} onValueChange={(val) => setReturnCondition(val as HtCondition)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kondisi..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOOD">{tHt('condition.good')}</SelectItem>
                    <SelectItem value="LIGHT_DAMAGE">{tHt('condition.light_damage')}</SelectItem>
                    <SelectItem value="HEAVY_DAMAGE">{tHt('condition.heavy_damage')}</SelectItem>
                    <SelectItem value="LOST">{tHt('condition.lost')}</SelectItem>
                    <SelectItem value="OTHER">{tHt('condition.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Note Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                {t('noteLabel')} {actionType === 'REJECT' && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                placeholder={actionType === 'APPROVE' ? t('notePlaceholder') : t('rejectNotePlaceholder')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              variant={actionType === 'APPROVE' ? 'default' : 'destructive'}
              onClick={handleProcessRequest}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {(approveMutation.isPending || rejectMutation.isPending) && <Loader2 className="mr-2 size-4 animate-spin" />}
              {actionType === 'APPROVE' ? t('approve') : t('reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
