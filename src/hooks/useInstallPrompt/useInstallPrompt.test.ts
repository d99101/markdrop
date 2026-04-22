// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useInstallPrompt } from './useInstallPrompt'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useInstallPrompt', () => {
  it('bannerState starts as hidden', () => {
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.bannerState).toBe('hidden')
  })

  it('fires to visible when beforeinstallprompt is dispatched', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => {
      const event = new Event('beforeinstallprompt')
      Object.assign(event, { prompt: vi.fn().mockResolvedValue(undefined) })
      window.dispatchEvent(event)
    })
    expect(result.current.bannerState).toBe('visible')
  })

  it('transitions to fading after 3500ms', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => {
      const event = new Event('beforeinstallprompt')
      Object.assign(event, { prompt: vi.fn().mockResolvedValue(undefined) })
      window.dispatchEvent(event)
    })
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    expect(result.current.bannerState).toBe('fading')
  })

  it('transitions to hidden after 4200ms', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => {
      const event = new Event('beforeinstallprompt')
      Object.assign(event, { prompt: vi.fn().mockResolvedValue(undefined) })
      window.dispatchEvent(event)
    })
    act(() => {
      vi.advanceTimersByTime(4200)
    })
    expect(result.current.bannerState).toBe('hidden')
  })

  it('onDismiss sets to fading immediately', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => {
      const event = new Event('beforeinstallprompt')
      Object.assign(event, { prompt: vi.fn().mockResolvedValue(undefined) })
      window.dispatchEvent(event)
    })
    act(() => {
      result.current.onDismiss()
    })
    expect(result.current.bannerState).toBe('fading')
  })
})
