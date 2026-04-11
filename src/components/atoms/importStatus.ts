/** UI tone for import / toolbar status lines (mirrors feature import states without importing features). */
export type ImportStatusTone = 'idle' | 'success' | 'error'

export function importStatusClassName(statusType: ImportStatusTone): string {
  if (statusType === 'success') {
    return 'status-text-success'
  }
  if (statusType === 'error') {
    return 'status-text-error'
  }
  return 'status-text-idle'
}
