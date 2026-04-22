// Copyright (c) 2026 David Linde. MIT License.
import { useState, useCallback } from 'react'

export function useDragDrop(onFile: (file: File) => void) {
  const [dragging, setDragging] = useState(false)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  return { dragging, onDrop, onDragOver, onDragLeave }
}
