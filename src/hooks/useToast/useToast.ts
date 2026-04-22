// Copyright (c) 2026 David Linde. MIT License.
import { useState, useRef, useCallback } from 'react'

export type ToastState = 'hidden' | 'visible' | 'fading'

export function useToast(visibleMs = 2000) {
  const [state, setState] = useState<ToastState>('hidden')
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const show = useCallback(() => {
    clearTimers()
    setState('visible')
    fadeTimer.current = setTimeout(() => setState('fading'), visibleMs)
    hideTimer.current = setTimeout(() => setState('hidden'), visibleMs + 700)
  }, [visibleMs])

  const dismiss = useCallback(() => {
    clearTimers()
    setState('fading')
    hideTimer.current = setTimeout(() => setState('hidden'), 700)
  }, [])

  return { state, show, dismiss }
}
