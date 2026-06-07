'use client'

import { AlertTriangle, CheckCircle2, CircleX, EyeOff, HelpCircle, RadioReceiver, Wrench } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { HtCondition, HtStatus } from '@/types/ht'

interface HtConditionBadgeProps {
  condition: HtCondition
  label: string
}

interface HtStatusBadgeProps {
  status: HtStatus
  label: string
}

export function HtConditionBadge({ condition, label }: HtConditionBadgeProps): React.JSX.Element {
  let Icon = HelpCircle
  let colorClass = 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300'

  switch (condition) {
    case 'GOOD':
      Icon = CheckCircle2
      colorClass = 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300'
      break
    case 'LIGHT_DAMAGE':
      Icon = AlertTriangle
      colorClass = 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
      break
    case 'HEAVY_DAMAGE':
      Icon = CircleX
      colorClass = 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300'
      break
    case 'LOST':
      Icon = EyeOff
      colorClass = 'border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
      break
    case 'OTHER':
      Icon = HelpCircle
      colorClass = 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300'
      break
  }

  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', colorClass)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

export function HtStatusBadge({ status, label }: HtStatusBadgeProps): React.JSX.Element {
  const isAvailable = status === 'AVAILABLE'
  const Icon = isAvailable ? RadioReceiver : Wrench

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 font-medium',
        isAvailable
          ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300'
          : 'border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
