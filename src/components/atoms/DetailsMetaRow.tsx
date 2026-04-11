import type { ReactNode } from 'react'

type DetailsMetaRowProps = {
  label: string
  value: ReactNode
}

export function DetailsMetaRow({ label, value }: DetailsMetaRowProps) {
  return (
    <div className="details-meta-row">
      <dt className="text-muted font-medium">{label}</dt>
      <dd className="text-primary">{value}</dd>
    </div>
  )
}
