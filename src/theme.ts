// Copyright (c) 2026 David Linde. MIT License.
export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export interface Theme {
  resolved: ResolvedTheme
  bg: string
  surface: string
  border: string
  text: string
  textMuted: string
  hover: string
  activeBg: string
  activeText: string
  inlineCodeBg: string
  inlineCodeText: string
  inlineCodeBorder: string
  tableHeaderBg: string
}

const light: Omit<Theme, 'resolved'> = {
  bg: '#ffffff',
  surface: '#fafafa',
  border: '#ddd',
  text: '#1a1a1a',
  textMuted: '#555',
  hover: '#ececec',
  activeBg: '#d0d0d0',
  activeText: '#1a1a1a',
  inlineCodeBg: '#f6f8fa',
  inlineCodeText: '#1a1a1a',
  inlineCodeBorder: '#d0d7de',
  tableHeaderBg: '#f6f8fa',
}

const dark: Omit<Theme, 'resolved'> = {
  bg: '#1e1e1e',
  surface: '#252526',
  border: '#3e3e42',
  text: '#d4d4d4',
  textMuted: '#999',
  hover: '#3a3a3a',
  activeBg: '#4a4a4a',
  activeText: '#e0e0e0',
  inlineCodeBg: '#2d2d30',
  inlineCodeText: '#d4d4d4',
  inlineCodeBorder: '#4a4a4f',
  tableHeaderBg: '#2d2d30',
}

export function buildTheme(resolved: ResolvedTheme): Theme {
  return { resolved, ...(resolved === 'dark' ? dark : light) }
}
