import { describe, it, expect } from 'vitest'
import { buildTheme } from './theme'

describe('buildTheme', () => {
  it('sets resolved to light', () => {
    expect(buildTheme('light').resolved).toBe('light')
  })

  it('sets resolved to dark', () => {
    expect(buildTheme('dark').resolved).toBe('dark')
  })

  it('light theme has white background', () => {
    expect(buildTheme('light').bg).toBe('#ffffff')
  })

  it('dark theme has dark background', () => {
    expect(buildTheme('dark').bg).toBe('#1e1e1e')
  })

  it('light and dark themes have different surfaces', () => {
    expect(buildTheme('light').surface).not.toBe(buildTheme('dark').surface)
  })

  it('returns all required theme keys', () => {
    const keys = ['bg', 'surface', 'border', 'text', 'textMuted', 'hover', 'activeBg', 'activeText']
    const theme = buildTheme('light')
    for (const key of keys) {
      expect(theme).toHaveProperty(key)
    }
  })
})
