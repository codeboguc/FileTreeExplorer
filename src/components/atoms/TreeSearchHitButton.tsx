import { EllipsisHoverTitle } from '@/components/atoms/EllipsisHoverTitle'

type TreeSearchHitButtonProps = {
  name: string
  pathLabel: string
  onPick: () => void
}

export function TreeSearchHitButton({ name, pathLabel, onPick }: TreeSearchHitButtonProps) {
  return (
    <button
      type="button"
      role="option"
      className="app-toolbar-search-dropdown-item"
      aria-label={`${name}, ${pathLabel}`}
      onMouseDown={(event) => {
        event.preventDefault()
        onPick()
      }}
    >
      <EllipsisHoverTitle text={name} className="app-toolbar-search-dropdown-name" />
      <EllipsisHoverTitle text={pathLabel} className="app-toolbar-search-dropdown-path" />
    </button>
  )
}
