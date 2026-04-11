import type { PropsWithChildren, ReactNode } from 'react'

type PanelProps = PropsWithChildren<{
  title: ReactNode
  rightSlot?: ReactNode
  className?: string
  bodyClassName?: string
}>

export function Panel({
  title,
  rightSlot,
  className,
  bodyClassName,
  children,
}: PanelProps) {
  const rootClassName = ['panel-shell', className].filter(Boolean).join(' ')

  const contentClassName = ['p-3', bodyClassName].filter(Boolean).join(' ')

  return (
    <section className={rootClassName}>
      <header className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {rightSlot}
      </header>
      <div className={contentClassName}>{children}</div>
    </section>
  )
}
