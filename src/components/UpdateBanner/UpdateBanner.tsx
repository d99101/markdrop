// Copyright (c) 2026 David Linde. MIT License.
import { Theme } from '../../theme'

export function UpdateBanner({
  theme: t,
  onUpdate,
}: {
  theme: Theme
  onUpdate: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '4.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '8px',
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.82rem',
        color: t.text,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        zIndex: 1000,
        whiteSpace: 'nowrap',
      }}
    >
      <span>New version available</span>
      <button
        onClick={onUpdate}
        style={{
          background: t.text,
          color: t.surface,
          border: 'none',
          borderRadius: '5px',
          padding: '0.25rem 0.7rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Reload
      </button>
    </div>
  )
}
