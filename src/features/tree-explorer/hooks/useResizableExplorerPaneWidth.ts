import {
  readExplorerPaneWidthPx,
  writeExplorerPaneWidthPx,
} from '@/services/explorerPaneWidthLocalStorage'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'

/** Default explorer column width on first visit (lg+ split). */
const DEFAULT_EXPLORER_PX = 320
/** Smallest draggable explorer width. */
const MIN_EXPLORER_PX = 220
/** Hard cap for explorer width (drag cannot exceed this unless viewport forces lower). */
const MAX_EXPLORER_CAP_PX = 720
/** Details column must stay at least this wide (lg+ split). */
const MIN_DETAILS_PX = 280
const HANDLE_PX = 8
/** Horizontal gaps on `.app-main-grid--split-resizable` (lg+) — two gutters between three tracks. */
const SPLIT_GRID_GAP_TOTAL_PX = 8 * 2

function clampExplorerWidth(
  desired: number,
  containerWidthPx: number,
): { width: number; maxAllowed: number } {
  const maxAllowed = Math.min(
    MAX_EXPLORER_CAP_PX,
    Math.max(
      MIN_EXPLORER_PX,
      containerWidthPx - SPLIT_GRID_GAP_TOTAL_PX - HANDLE_PX - MIN_DETAILS_PX,
    ),
  )
  const width = Math.min(maxAllowed, Math.max(MIN_EXPLORER_PX, desired))
  return { width, maxAllowed }
}

type PaneState = {
  explorerWidthPx: number
  explorerMaxAllowedPx: number
}

type PaneAction = {
  type: 'apply'
  containerWidthPx: number
  desiredWidthPx: number
}

function paneReducer(_prev: PaneState, action: PaneAction): PaneState {
  const { width, maxAllowed } = clampExplorerWidth(
    action.desiredWidthPx,
    action.containerWidthPx,
  )
  return { explorerWidthPx: width, explorerMaxAllowedPx: maxAllowed }
}

function readInitialWidth(): number {
  const stored = readExplorerPaneWidthPx()
  return stored !== null ? stored : DEFAULT_EXPLORER_PX
}

export function useResizableExplorerPaneWidth(
  containerRef: RefObject<HTMLElement | null>,
) {
  const [pane, dispatch] = useReducer(paneReducer, undefined, () => {
    const w = readInitialWidth()
    return {
      explorerWidthPx: w,
      explorerMaxAllowedPx: MAX_EXPLORER_CAP_PX,
    }
  })

  const dragRef = useRef<{
    startPointerX: number
    startWidth: number
  } | null>(null)

  const explorerWidthRef = useRef(pane.explorerWidthPx)

  useLayoutEffect(() => {
    explorerWidthRef.current = pane.explorerWidthPx
  }, [pane.explorerWidthPx])

  const applyMeasured = useCallback(
    (containerWidthPx: number, desiredWidthPx: number) => {
      const { width } = clampExplorerWidth(desiredWidthPx, containerWidthPx)
      explorerWidthRef.current = width
      dispatch({
        type: 'apply',
        containerWidthPx,
        desiredWidthPx,
      })
    },
    [],
  )

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) {
      return
    }
    applyMeasured(rect.width, explorerWidthRef.current)
  }, [applyMeasured, containerRef])

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') {
      return
    }
    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width
      if (w <= 0) {
        return
      }
      const prev = explorerWidthRef.current
      const { width } = clampExplorerWidth(prev, w)
      applyMeasured(w, prev)
      if (width !== prev) {
        writeExplorerPaneWidthPx(width)
      }
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
    }
  }, [applyMeasured, containerRef])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return
      }
      const el = containerRef.current
      if (!el) {
        return
      }
      const rect = el.getBoundingClientRect()
      const { width: startWidth } = clampExplorerWidth(
        explorerWidthRef.current,
        rect.width,
      )
      dragRef.current = {
        startPointerX: event.clientX,
        startWidth,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [containerRef],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag) {
        return
      }
      const el = containerRef.current
      if (!el) {
        return
      }
      const w = el.getBoundingClientRect().width
      const delta = event.clientX - drag.startPointerX
      applyMeasured(w, drag.startWidth + delta)
    },
    [applyMeasured, containerRef],
  )

  const endDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current) {
      dragRef.current = null
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {
        /* ignore if already released */
      }
    }
  }, [])

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      endDrag(event)
      writeExplorerPaneWidthPx(explorerWidthRef.current)
    },
    [endDrag],
  )

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      endDrag(event)
    },
    [endDrag],
  )

  const nudgeExplorerWidth = useCallback(
    (deltaPx: number) => {
      const el = containerRef.current
      if (!el) {
        return
      }
      const w = el.getBoundingClientRect().width
      const nextDesired = explorerWidthRef.current + deltaPx
      const { width } = clampExplorerWidth(nextDesired, w)
      applyMeasured(w, nextDesired)
      writeExplorerPaneWidthPx(width)
    },
    [applyMeasured, containerRef],
  )

  const onSeparatorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        nudgeExplorerWidth(-16)
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        nudgeExplorerWidth(16)
      }
    },
    [nudgeExplorerWidth],
  )

  return {
    explorerWidthPx: pane.explorerWidthPx,
    explorerMaxAllowedPx: pane.explorerMaxAllowedPx,
    separatorProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onKeyDown: onSeparatorKeyDown,
    },
  }
}
