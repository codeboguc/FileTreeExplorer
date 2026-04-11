import type { ImportStatusTone } from '@/components/molecules/import-status'

export function importStatusClassName(statusType: ImportStatusTone): string {
  if (statusType === 'success') {
    return 'status-text-success'
  }
  if (statusType === 'error') {
    return 'status-text-error'
  }
  return 'status-text-idle'
}
