import { DetailsMetaRow } from '@/components/atoms/DetailsMetaRow'
import type { ReactNode } from 'react'

type DetailsMetaItem = {
  label: string
  value: ReactNode
}

type DetailsMetaGridProps = {
  items: DetailsMetaItem[]
  className?: string
}

export function DetailsMetaGrid({ items, className }: DetailsMetaGridProps) {
  const classes = ['details-meta-grid', className].filter(Boolean).join(' ')

  return (
    <dl className={classes}>
      {items.map((item) => (
        <DetailsMetaRow key={item.label} label={item.label} value={item.value} />
      ))}
    </dl>
  )
}
