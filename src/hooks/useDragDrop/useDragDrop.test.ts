// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDragDrop } from './useDragDrop'

function makeDragEvent(files: File[] = []): React.DragEvent {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: { files },
  } as unknown as React.DragEvent
}

describe('useDragDrop', () => {
  it('onDragOver sets dragging to true', () => {
    const { result } = renderHook(() => useDragDrop(vi.fn()))
    act(() => result.current.onDragOver(makeDragEvent()))
    expect(result.current.dragging).toBe(true)
  })

  it('onDragLeave sets dragging to false', () => {
    const { result } = renderHook(() => useDragDrop(vi.fn()))
    act(() => result.current.onDragOver(makeDragEvent()))
    act(() => result.current.onDragLeave(makeDragEvent()))
    expect(result.current.dragging).toBe(false)
  })

  it('onDrop calls onFile with the dropped file', () => {
    const onFile = vi.fn()
    const { result } = renderHook(() => useDragDrop(onFile))
    const file = new File(['content'], 'test.md')
    act(() => result.current.onDrop(makeDragEvent([file])))
    expect(onFile).toHaveBeenCalledWith(file)
  })

  it('drop with .pdf file does NOT call onFile', () => {
    const onFile = vi.fn()
    const { result } = renderHook(() => useDragDrop(onFile))
    const file = new File(['content'], 'document.pdf')
    act(() => result.current.onDrop(makeDragEvent([file])))
    expect(onFile).not.toHaveBeenCalled()
  })

  it('drop with .md file DOES call onFile', () => {
    const onFile = vi.fn()
    const { result } = renderHook(() => useDragDrop(onFile))
    const file = new File(['# Hello'], 'readme.md')
    act(() => result.current.onDrop(makeDragEvent([file])))
    expect(onFile).toHaveBeenCalledWith(file)
  })
})
