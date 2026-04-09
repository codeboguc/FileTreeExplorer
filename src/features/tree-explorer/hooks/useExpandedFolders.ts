import { useCallback, useState } from 'react'

const ROOT_PATH_KEY = 'root::0'

export const useExpandedFolders = () => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    () => new Set([ROOT_PATH_KEY]),
  )

  const isExpanded = useCallback(
    (path: string) => expandedPaths.has(path),
    [expandedPaths],
  )

  const toggleExpanded = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
        const descendantPrefix = `${path}/`
        for (const expandedPath of [...next]) {
          if (expandedPath.startsWith(descendantPrefix)) {
            next.delete(expandedPath)
          }
        }
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const resetExpanded = useCallback(() => {
    setExpandedPaths(new Set([ROOT_PATH_KEY]))
  }, [])

  return { isExpanded, toggleExpanded, resetExpanded }
}
