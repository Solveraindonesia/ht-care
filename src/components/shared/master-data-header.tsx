'use client'

import { Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MasterDataHeaderProps {
  title: string
  description: string
  searchLabel: string
  searchPlaceholder: string
  addLabel: string
  searchValue: string
  onSearchChange: (value: string) => void
  onAdd: () => void
}

export function MasterDataHeader({
  title,
  description,
  searchLabel,
  searchPlaceholder,
  addLabel,
  searchValue,
  onSearchChange,
  onAdd
}: MasterDataHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
        <label className="relative w-full sm:w-80">
          <span className="sr-only">{searchLabel}</span>
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            className="h-10 rounded-xl pl-9"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <Button type="button" className="h-10 rounded-xl" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  )
}
