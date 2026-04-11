import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode
}

export function IconButton({
  type = 'button',
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  )
}
