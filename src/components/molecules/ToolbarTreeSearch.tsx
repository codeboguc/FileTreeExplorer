import { KbdHint } from '@/components/atoms/KbdHint'
import { TreeSearchHitButton } from '@/components/atoms/TreeSearchHitButton'
import { formatNodePathForDisplay } from '@/lib/fileTree'
import { Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const trimmed = value.trim()
  const showDropdown = isFocused && trimmed.length > 0

  const searchShortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return t('toolbar.searchShortcutWin')
    }
    return /Mac|iPhone|iPad/i.test(navigator.userAgent)
      ? t('toolbar.searchShortcutMac')
      : t('toolbar.searchShortcutWin')
  }, [t])

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
          {t('toolbar.searchLabel')}
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
          placeholder={t('toolbar.searchPlaceholder')}
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
        <KbdHint title={t('toolbar.searchKbdTitle')} aria-hidden>
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
          aria-label={t('toolbar.searchResultsLabel')}
        >
          {results.length === 0 ? (
            <li className="app-toolbar-search-dropdown-empty" role="presentation">
              {t('toolbar.searchNoMatches')}
            </li>
          ) : (
            results.map((hit) => {
              const pathLabel = formatNodePathForDisplay(hit.fullPath)
              return (
                <li key={hit.fullPath} role="presentation">
                  <TreeSearchHitButton
                    name={hit.name}
                    pathLabel={pathLabel}
                    onPick={() => handleSelectHit(hit.fullPath)}
                  />
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
