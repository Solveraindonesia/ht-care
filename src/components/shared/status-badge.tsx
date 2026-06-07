'use client'

import { CheckCircle2, CircleX, RadioReceiver, Wrench } from 'lucide-react'

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
  const isGood = condition === 'GOOD'
  const Icon = isGood ? CheckCircle2 : CircleX

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 font-medium',
        isGood
          ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300'
          : 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300'
      )}
    >
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
