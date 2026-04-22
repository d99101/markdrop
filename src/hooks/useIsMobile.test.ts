// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from './useIsMobile'

describe('useIsMobile', () => {
  it('defaults to false (matchMedia mock returns false)', () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
