import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
})

describe('useTheme', () => {
  it('defaults to system mode', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.mode).toBe('system')
  })

  it('persists mode to localStorage on change', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setMode('dark'))
    expect(localStorage.getItem('markdrop_theme')).toBe('dark')
  })

  it('restores mode from localStorage', () => {
    localStorage.setItem('markdrop_theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.mode).toBe('light')
  })

  it('returns a theme object', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toHaveProperty('bg')
    expect(result.current.theme).toHaveProperty('resolved')
  })

  it('resolved matches set mode', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setMode('dark'))
    expect(result.current.theme.resolved).toBe('dark')
  })
})
