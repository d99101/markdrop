// Copyright (c) 2026 David Linde. MIT License.
import { Theme } from '../../theme'
import { Dialog } from '../Dialog'

export function ConfirmDialog({
  theme: t,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: {
  theme: Theme
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Dialog theme={t} onClose={onCancel} maxWidth={360}>
      <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', lineHeight: 1.6, color: t.text }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: `1px solid ${t.border}`,
            borderRadius: '6px',
            padding: '0.35rem 0.9rem',
            fontSize: '0.85rem',
            cursor: 'pointer',
            color: t.textMuted,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = t.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          style={{
            background: t.text,
            border: 'none',
            borderRadius: '6px',
            padding: '0.35rem 0.9rem',
            fontSize: '0.85rem',
            cursor: 'pointer',
            color: t.surface,
            fontWeight: 600,
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}
