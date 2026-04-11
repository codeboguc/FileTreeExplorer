import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { KbdHint } from '../atoms/KbdHint'

type ToolbarSearchFieldProps = {
  /** When false, renders nothing (parent supplies layout spacer). */
  enabled: boolean
  id?: string
  value: string
  onChange: (value: string) => void
}

export function ToolbarSearchField({
  enabled,
  id = 'app-tree-search',
  value,
  onChange,
}: ToolbarSearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const searchShortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return '⌘K'
    }
    return /Mac|iPhone|iPad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K'
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <div className="app-toolbar-search-field">
      <Search className="app-toolbar-search-icon size-4" aria-hidden />
      <label className="sr-only" htmlFor={id}>
        Search tree by name
      </label>
      <input
        ref={inputRef}
        id={id}
        type="search"
        className="app-toolbar-search"
        placeholder="Search files and folders…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <KbdHint title="Focus search (Ctrl+K or ⌘K)" aria-hidden>
        {searchShortcutLabel}
      </KbdHint>
    </div>
  )
}
