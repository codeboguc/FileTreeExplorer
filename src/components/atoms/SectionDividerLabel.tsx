import type { ReactNode } from 'react'

type SectionDividerLabelProps = {
  children: ReactNode
  className?: string
}

/** Horizontal rule with centered label (e.g. “or paste below”). */
export function SectionDividerLabel({ children, className }: SectionDividerLabelProps) {
  return (
    <p className={['json-import-divider', className].filter(Boolean).join(' ')}>
      <span>{children}</span>
    </p>
  )
}
