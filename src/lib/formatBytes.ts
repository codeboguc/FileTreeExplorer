const K = 1024
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/**
 * Human-readable size using binary steps (1024). Non-finite or negative values become `0 B`.
 */
export function formatBytes(bytes: number): string {
  const n = Number(bytes)
  if (!Number.isFinite(n) || n <= 0) {
    return '0 B'
  }
  if (n < K) {
    return `${Math.round(n)} B`
  }

  let value = n
  let unitIndex = 0
  while (value >= K && unitIndex < UNITS.length - 1) {
    value /= K
    unitIndex += 1
  }

  const decimals = value >= 100 ? 1 : 2
  return `${value.toFixed(decimals)} ${UNITS[unitIndex]}`
}
