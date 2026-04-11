import { EllipsisHoverTitle } from '@/components/atoms/EllipsisHoverTitle'
import { KbdHint } from '@/components/atoms/KbdHint'
import { formatNodePathForDisplay } from '@/lib/fileTree'
import { Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** Scrollbar + capped height only when there are more than this many hits. */
const SEARCH_DROPDOWN_SCROLL_AFTER_COUNT = 7

export type ToolbarSearchHit = {
  fullPath: string
  name: string
  kind: 'file' | 'folder'
}

type ToolbarTreeSearchProps = {
  /** When false, renders nothing (parent supplies layout spacer). */
  enabled: boolean
  id?: string
  value: string
  onChange: (value: string) => void
  results: ToolbarSearchHit[]
  onSelectHit: (fullPath: string) => void
}

export function ToolbarTreeSearch({
  enabled,
  id = 'app-tree-search',
  value,
  onChange,
  results,
  onSelectHit,
}: ToolbarTreeSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const trimmed = value.trim()
  const showDropdown = isFocused && trimmed.length > 0

  const searchShortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return 'Ctrl+Alt+F'
    }
    return /Mac|iPhone|iPad/i.test(navigator.userAgent) ? '⌃⌥F' : 'Ctrl+Alt+F'
  }, [])

  const cancelBlurClose = useCallback(() => {
    if (blurTimeoutRef.current !== null) {
      clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = null
    }
  }, [])

  const scheduleBlurClose = useCallback(() => {
    cancelBlurClose()
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false)
      blurTimeoutRef.current = null
    }, 150)
  }, [cancelBlurClose])

  useEffect(() => {
    return () => cancelBlurClose()
  }, [cancelBlurClose])

  useEffect(() => {
    if (!enabled) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        event.altKey &&
        !event.metaKey &&
        event.key.toLowerCase() === 'f'
      ) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])

  const handleSelectHit = useCallback(
    (fullPath: string) => {
      cancelBlurClose()
      setIsFocused(false)
      onSelectHit(fullPath)
      inputRef.current?.blur()
    },
    [cancelBlurClose, onSelectHit],
  )

  if (!enabled) {
    return null
  }

  const dropdownScrollable =
    showDropdown && results.length > SEARCH_DROPDOWN_SCROLL_AFTER_COUNT

  return (
    <div className="app-toolbar-search-combo">
      <div className="app-toolbar-search-field">
        <Search className="app-toolbar-search-icon size-4" aria-hidden />
        <label className="sr-only" htmlFor={id}>
          Search tree by name
        </label>
        <input
          ref={inputRef}
          id={id}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          className="app-toolbar-search"
          placeholder="Search files and folders…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            cancelBlurClose()
            setIsFocused(true)
          }}
          onBlur={scheduleBlurClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              setIsFocused(false)
              inputRef.current?.blur()
            }
          }}
          autoComplete="off"
        />
        <KbdHint title="Focus search (Ctrl+Alt+F; on Mac: Control+Option+F)" aria-hidden>
          {searchShortcutLabel}
        </KbdHint>
      </div>

      {showDropdown ? (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className={
            dropdownScrollable
              ? 'app-toolbar-search-dropdown app-toolbar-search-dropdown--scrollable'
              : 'app-toolbar-search-dropdown'
          }
          aria-label="Search results"
        >
          {results.length === 0 ? (
            <li className="app-toolbar-search-dropdown-empty" role="presentation">
              No matches
            </li>
          ) : (
            results.map((hit) => {
              const pathLabel = formatNodePathForDisplay(hit.fullPath)
              return (
                <li key={hit.fullPath} role="presentation">
                  <button
                    type="button"
                    role="option"
                    className="app-toolbar-search-dropdown-item"
                    aria-label={`${hit.name}, ${pathLabel}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelectHit(hit.fullPath)
                    }}
                  >
                    <EllipsisHoverTitle
                      text={hit.name}
                      className="app-toolbar-search-dropdown-name"
                    />
                    <EllipsisHoverTitle
                      text={pathLabel}
                      className="app-toolbar-search-dropdown-path"
                    />
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
