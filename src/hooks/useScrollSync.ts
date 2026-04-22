// Copyright (c) 2026 David Linde. MIT License.
import { useRef, useEffect } from 'react'
import { EditorView } from '@codemirror/view'
import type { ViewMode } from '../components/SegmentedControl'

export function useScrollSync(
  effectiveViewMode: ViewMode,
  editorViewRef: React.MutableRefObject<EditorView | null>,
  previewRef: React.RefObject<HTMLDivElement | null>
): void {
  const syncingRef = useRef(false)

  useEffect(() => {
    if (effectiveViewMode !== 'both') return
    const editorScroll = editorViewRef.current?.scrollDOM
    const preview = previewRef.current
    if (!editorScroll || !preview) return

    const onEditorScroll = () => {
      if (syncingRef.current) return
      syncingRef.current = true
      const pct = editorScroll.scrollTop / (editorScroll.scrollHeight - editorScroll.clientHeight || 1)
      preview.scrollTop = pct * (preview.scrollHeight - preview.clientHeight)
      requestAnimationFrame(() => { syncingRef.current = false })
    }
    const onPreviewScroll = () => {
      if (syncingRef.current) return
      syncingRef.current = true
      const pct = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1)
      editorScroll.scrollTop = pct * (editorScroll.scrollHeight - editorScroll.clientHeight)
      requestAnimationFrame(() => { syncingRef.current = false })
    }

    editorScroll.addEventListener('scroll', onEditorScroll)
    preview.addEventListener('scroll', onPreviewScroll)
    return () => {
      editorScroll.removeEventListener('scroll', onEditorScroll)
      preview.removeEventListener('scroll', onPreviewScroll)
    }
  }, [effectiveViewMode, editorViewRef, previewRef])
}
