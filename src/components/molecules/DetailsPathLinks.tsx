import { formatNodePathForDisplay, getNodePathLinkParts } from '@/lib/fileTree'

type DetailsPathLinksProps = {
  fullPath: string
  onSelectPath?: (path: string) => void
}

/** Clickable path segments: opens each ancestor (or the full path) in the explorer. */
export function DetailsPathLinks({ fullPath, onSelectPath }: DetailsPathLinksProps) {
  const parts = getNodePathLinkParts(fullPath)
  const displayPlain = formatNodePathForDisplay(fullPath)

  if (!onSelectPath) {
    return <span className="details-path-plain">{displayPlain}</span>
  }

  if (parts.length === 0) {
    return <span className="details-path-plain">{displayPlain}</span>
  }

  if (parts.length === 1) {
    const only = parts[0]
    return (
      <button
        type="button"
        className="details-path-segment-btn details-path-segment-btn--current"
        onClick={() => onSelectPath(only.fullPath)}
      >
        {only.label}
      </button>
    )
  }

  return (
    <span className="details-path-links">
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1
        return (
          <span key={part.fullPath} className="details-path-segment-wrap">
            {index > 0 ? <span className="details-path-sep">/</span> : null}
            <button
              type="button"
              className={
                isLast
                  ? 'details-path-segment-btn details-path-segment-btn--current'
                  : 'details-path-segment-btn'
              }
              onClick={() => onSelectPath(part.fullPath)}
            >
              {part.label}
            </button>
          </span>
        )
      })}
    </span>
  )
}
