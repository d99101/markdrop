// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDocument } from './useDocument'
import { MARKDROP_README } from '../../markdropReadme'

beforeEach(() => {
  sessionStorage.clear()
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDocument', () => {
  it('initial content is null when sessionStorage empty', () => {
    const { result } = renderHook(() => useDocument())
    expect(result.current.content).toBeNull()
  })

  it('startBlank sets content to empty string', () => {
    const { result } = renderHook(() => useDocument())
    act(() => result.current.startBlank())
    expect(result.current.content).toBe('')
  })

  it('handleChange updates content immediately and persists to sessionStorage after debounce', () => {
    const { result } = renderHook(() => useDocument())
    act(() => result.current.handleChange('# Hello'))
    // Content state is immediate
    expect(result.current.content).toBe('# Hello')
    // sessionStorage write is debounced — not set yet
    expect(sessionStorage.getItem('markdrop_content')).toBeNull()
    // After 500ms debounce, sessionStorage is written
    act(() => vi.advanceTimersByTime(500))
    expect(sessionStorage.getItem('markdrop_content')).toBe('# Hello')
  })

  it('handleFileNameChange updates fileName and persists', () => {
    const { result } = renderHook(() => useDocument())
    act(() => result.current.handleFileNameChange('my-doc.md'))
    expect(result.current.fileName).toBe('my-doc.md')
    expect(sessionStorage.getItem('markdrop_filename')).toBe('my-doc.md')
  })

  it('loadMarkdropReadme sets content to MARKDROP_README', () => {
    const { result } = renderHook(() => useDocument())
    act(() => result.current.loadMarkdropReadme())
    expect(result.current.content).toBe(MARKDROP_README)
    expect(result.current.content).toBeTruthy()
  })

  it('readFile reads a File object', async () => {
    const { result } = renderHook(() => useDocument())
    const file = new File(['# test'], 'test.md', { type: 'text/markdown' })
    act(() => result.current.readFile(file))
    await waitFor(() => {
      expect(result.current.content).toBe('# test')
      expect(result.current.fileName).toBe('test.md')
    })
  })
})
