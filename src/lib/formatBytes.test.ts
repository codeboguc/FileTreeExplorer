import { formatBytes } from '@/lib/formatBytes'

describe('formatBytes', () => {
  it('formats bytes', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1)).toBe('1 B')
    expect(formatBytes(1023)).toBe('1023 B')
  })

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1.00 KB')
    expect(formatBytes(1536)).toBe('1.50 KB')
  })

  it('formats megabytes and above', () => {
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB')
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB')
    expect(formatBytes(1024 ** 4)).toBe('1.00 TB')
  })

  it('handles edge numeric inputs', () => {
    expect(formatBytes(-1)).toBe('0 B')
    expect(formatBytes(Number.NaN)).toBe('0 B')
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('0 B')
  })
})
