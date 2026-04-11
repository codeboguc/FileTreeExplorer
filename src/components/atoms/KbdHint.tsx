import type { HTMLAttributes, ReactNode } from 'react'

type KbdHintProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children: ReactNode
}

/** Small keyboard shortcut hint (toolbar search, etc.). */
export function KbdHint({ className, children, ...rest }: KbdHintProps) {
  const classes = ['app-toolbar-search-kbd', className].filter(Boolean).join(' ')
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}
