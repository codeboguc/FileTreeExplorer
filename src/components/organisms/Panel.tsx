import type { PropsWithChildren, ReactNode } from 'react'

type PanelProps = PropsWithChildren<{
  title: ReactNode
  rightSlot?: ReactNode
  className?: string
  bodyClassName?: string
  /** Fill parent height and scroll overflowing body (explorer / details columns). */
  fillScrollBody?: boolean
  /**
   * With `fillScrollBody`: `y` = vertical scrollbar only (details).
   * `xy` = vertical + horizontal (explorer tree).
   */
  fillScrollAxes?: 'y' | 'xy'
}>

export function Panel({
  title,
  rightSlot,
  className,
  bodyClassName,
  fillScrollBody,
  fillScrollAxes = 'y',
  children,
}: PanelProps) {
  const rootClassName = [
    'panel-shell',
    fillScrollBody && 'panel-shell--fill-scroll',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const defaultBodyClass = ['p-3', bodyClassName].filter(Boolean).join(' ')

  return (
    <section className={rootClassName}>
      <header className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {rightSlot ? <div className="panel-header-aside">{rightSlot}</div> : null}
      </header>
      {fillScrollBody ? (
        <div className={`panel-shell__fill-scroll-outer ${defaultBodyClass}`}>
          <div
            className={`panel-shell__fill-scroll-inner panel-shell__fill-scroll-inner--${fillScrollAxes}`}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className={defaultBodyClass}>{children}</div>
      )}
    </section>
  )
}
