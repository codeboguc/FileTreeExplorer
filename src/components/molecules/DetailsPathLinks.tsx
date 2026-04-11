type DetailsPathLinksProps = {
  fullPath: string
  onSelectPath?: (path: string) => void
}

/** Clickable path segments: opens each ancestor (or the full path) in the explorer. */
export function DetailsPathLinks({ fullPath, onSelectPath }: DetailsPathLinksProps) {
  const segments = fullPath.split('/').filter(Boolean)

  if (!onSelectPath) {
    return <span className="details-path-plain">{fullPath}</span>
  }

  if (segments.length <= 1) {
    return (
      <button
        type="button"
        className="details-path-segment-btn details-path-segment-btn--current"
        onClick={() => onSelectPath(fullPath)}
      >
        {fullPath}
      </button>
    )
  }

  return (
    <span className="details-path-links">
      {segments.map((segment, index) => {
        const pathUpTo = segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        return (
          <span key={pathUpTo} className="details-path-segment-wrap">
            {index > 0 ? <span className="details-path-sep">/</span> : null}
            <button
              type="button"
              className={
                isLast
                  ? 'details-path-segment-btn details-path-segment-btn--current'
                  : 'details-path-segment-btn'
              }
              onClick={() => onSelectPath(pathUpTo)}
            >
              {segment}
            </button>
          </span>
        )
      })}
    </span>
  )
}
