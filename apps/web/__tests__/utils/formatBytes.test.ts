import { formatBytes } from '@/lib/utils'

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1)).toBe('1 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1 TB')
  })

  it('handles decimal values correctly', () => {
    expect(formatBytes(1500)).toBe('1.46 KB')
    expect(formatBytes(1500000)).toBe('1.43 MB')
    expect(formatBytes(1500000000)).toBe('1.4 GB')
  })

  it('handles large numbers', () => {
    expect(formatBytes(1024 * 1024 * 1024 * 1024 * 1024)).toBe('1 PB')
    expect(formatBytes(1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toBe('1 EB')
  })

  it('handles negative numbers', () => {
    expect(formatBytes(-1)).toBe('-1 Bytes')
    expect(formatBytes(-1024)).toBe('-1 KB')
    expect(formatBytes(-1500)).toBe('-1.46 KB')
  })

  it('handles decimal precision', () => {
    expect(formatBytes(1024 + 512)).toBe('1.5 KB')
    expect(formatBytes(1024 * 1024 + 1024 * 512)).toBe('1.5 MB')
  })

  it('handles edge cases', () => {
    expect(formatBytes(NaN)).toBe('NaN Bytes')
    expect(formatBytes(Infinity)).toBe('Infinity Bytes')
    expect(formatBytes(-Infinity)).toBe('-Infinity Bytes')
  })

  it('handles very small numbers', () => {
    expect(formatBytes(0.5)).toBe('0.5 Bytes')
    expect(formatBytes(0.1)).toBe('0.1 Bytes')
    expect(formatBytes(0.01)).toBe('0.01 Bytes')
  })

  it('handles very large numbers', () => {
    const largeNumber = 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 // 1 ZB
    expect(formatBytes(largeNumber)).toBe('1 ZB')
  })

  it('handles numbers just below thresholds', () => {
    expect(formatBytes(1023)).toBe('1023 Bytes')
    expect(formatBytes(1024 * 1024 - 1)).toBe('1023 KB')
    expect(formatBytes(1024 * 1024 * 1024 - 1)).toBe('1023 MB')
  })

  it('handles numbers just above thresholds', () => {
    expect(formatBytes(1025)).toBe('1 KB')
    expect(formatBytes(1024 * 1024 + 1)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024 + 1)).toBe('1 GB')
  })

  it('handles zero with different decimal places', () => {
    expect(formatBytes(0, 0)).toBe('0 Bytes')
    expect(formatBytes(0, 1)).toBe('0.0 Bytes')
    expect(formatBytes(0, 2)).toBe('0.00 Bytes')
  })

  it('handles custom decimal places', () => {
    expect(formatBytes(1500, 0)).toBe('1 KB')
    expect(formatBytes(1500, 1)).toBe('1.5 KB')
    expect(formatBytes(1500, 2)).toBe('1.46 KB')
    expect(formatBytes(1500, 3)).toBe('1.465 KB')
  })

  it('handles boundary conditions', () => {
    // Test the exact boundary between units
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
    
    // Test one byte less than boundary
    expect(formatBytes(1023)).toBe('1023 Bytes')
    expect(formatBytes(1024 * 1024 - 1)).toBe('1023 KB')
    expect(formatBytes(1024 * 1024 * 1024 - 1)).toBe('1023 MB')
    
    // Test one byte more than boundary
    expect(formatBytes(1025)).toBe('1 KB')
    expect(formatBytes(1024 * 1024 + 1)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024 + 1)).toBe('1 GB')
  })
})
