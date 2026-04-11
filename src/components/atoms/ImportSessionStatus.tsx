import {
  type ImportStatusTone,
  importStatusClassName,
} from '@/components/atoms/importStatus'

type ImportSessionStatusProps = {
  message: string
  statusType: ImportStatusTone
  /** Live region + home import banner wrapper. */
  announce?: boolean
  className?: string
}

export function ImportSessionStatus({
  message,
  statusType,
  announce = false,
  className = '',
}: ImportSessionStatusProps) {
  const toneClass = importStatusClassName(statusType)
  const textSize = announce ? 'text-sm' : 'text-xs'
  const pClass = [textSize, toneClass, className].filter(Boolean).join(' ')

  const paragraph = <p className={pClass}>{message}</p>

  if (announce) {
    return (
      <div className="json-import-status" role="status" aria-live="polite" aria-atomic="true">
        {paragraph}
      </div>
    )
  }

  return paragraph
}
