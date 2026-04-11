import { useCallback, type PointerEvent } from 'react'

type EllipsisHoverTitleProps = {
  text: string
  className?: string
}

/** Sets native `title` only when single-line content is truncated (ellipsis). */
export function EllipsisHoverTitle({ text, className }: EllipsisHoverTitleProps) {
  const onPointerEnter = useCallback(
    (event: PointerEvent<HTMLSpanElement>) => {
      const el = event.currentTarget
      if (el.scrollWidth > el.clientWidth + 1) {
        el.setAttribute('title', text)
      } else {
        el.removeAttribute('title')
      }
    },
    [text],
  )

  const onPointerLeave = useCallback((event: PointerEvent<HTMLSpanElement>) => {
    event.currentTarget.removeAttribute('title')
  }, [])

  return (
    <span
      className={className}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {text}
    </span>
  )
}
