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
        <div key={item.label} className="details-meta-row">
          <dt className="text-muted font-medium">{item.label}</dt>
          <dd className="text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
