// Copyright (c) 2026 David Linde. MIT License.
import { useState, useEffect } from 'react'
import { ThemeMode, ResolvedTheme, Theme, buildTheme } from './theme'

const STORAGE_KEY = 'markdrop_theme'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme(): { theme: Theme; mode: ThemeMode; setMode: (m: ThemeMode) => void } {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system'
  )
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setMode = (m: ThemeMode) => {
    setModeState(m)
    localStorage.setItem(STORAGE_KEY, m)
  }

  const resolved: ResolvedTheme = mode === 'system' ? systemTheme : mode

  return { theme: buildTheme(resolved), mode, setMode }
}
