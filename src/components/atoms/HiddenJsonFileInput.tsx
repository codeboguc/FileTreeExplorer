import { forwardRef } from 'react'

type HiddenJsonFileInputProps = {
  onFileChange: (file: File | null) => void
  /** Allows picking the same file again (e.g. after an error). */
  clearValueAfterPick?: boolean
}

export const HiddenJsonFileInput = forwardRef<HTMLInputElement, HiddenJsonFileInputProps>(
  function HiddenJsonFileInput({ onFileChange, clearValueAfterPick = false }, ref) {
    return (
      <input
        ref={ref}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          onFileChange(event.target.files?.[0] ?? null)
          if (clearValueAfterPick) {
            event.target.value = ''
          }
        }}
      />
    )
  },
)
