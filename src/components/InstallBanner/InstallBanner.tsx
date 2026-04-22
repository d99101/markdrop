// Copyright (c) 2026 David Linde. MIT License.
import { Theme } from '../../theme'

export function InstallBanner({
  theme: t,
  state,
  onInstall,
  onDismiss,
}: {
  theme: Theme
  state: 'hidden' | 'visible' | 'fading'
  onInstall: () => void
  onDismiss: () => void
}) {
  if (state === 'hidden') return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '10px',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        fontSize: '0.85rem',
        color: t.text,
        zIndex: 1000,
        opacity: state === 'visible' ? 1 : 0,
        transition: 'opacity 0.6s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <img src={`${import.meta.env.BASE_URL}icon.svg`} width={20} height={20} alt="" />
      <span>Install Markdrop app</span>
      <button
        onClick={onInstall}
        style={{
          background: t.text,
          color: t.surface,
          border: 'none',
          borderRadius: '6px',
          padding: '0.3rem 0.75rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Install
      </button>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: t.textMuted,
          fontSize: '1rem',
          lineHeight: 1,
          padding: '0 0.1rem',
        }}
        title="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
