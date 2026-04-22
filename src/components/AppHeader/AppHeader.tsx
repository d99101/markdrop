// Copyright (c) 2026 David Linde. MIT License.
import { Theme, ThemeMode } from '../../theme'
import { SunIcon, MoonIcon, SystemIcon } from '../icons'
import { IconButton } from '../IconButton'

const THEME_ICONS = { system: <SystemIcon />, light: <SunIcon />, dark: <MoonIcon /> }
const THEME_TITLES = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' }

export function AppHeader({ theme: t, themeMode, onThemeCycle, onLogoClick, isMobile }: {
  theme: Theme
  themeMode: ThemeMode
  onThemeCycle: () => void
  onLogoClick: () => void
  isMobile?: boolean
}) {
  return (
    <div style={{
      padding: isMobile ? '0.75rem 1rem' : '0.75rem 1rem 0.5rem',
      borderBottom: `1px solid ${t.border}`,
      background: t.surface,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <button
        onClick={onLogoClick}
        title="Open Markdrop README"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: '1.4rem',
          letterSpacing: '-0.02em',
          color: t.text,
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <img src={`${import.meta.env.BASE_URL}icon.svg`} width={24} height={24} alt="" />
        Markdrop
      </button>
      <IconButton onClick={onThemeCycle} title={THEME_TITLES[themeMode]} theme={t} isMobile={isMobile}>
        {THEME_ICONS[themeMode]}
      </IconButton>
    </div>
  )
}
