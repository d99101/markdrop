// Copyright (c) 2026 David Linde. MIT License.
import { Theme } from '../../theme'

export type ViewMode = 'editor' | 'both' | 'preview'

export function SegmentedControl({
  value,
  onChange,
  options,
  theme: t,
  isMobile,
}: {
  value: ViewMode
  onChange: (v: ViewMode) => void
  options: { value: ViewMode; label: string }[]
  theme: Theme
  isMobile?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        border: `1px solid ${t.border}`,
        borderRadius: '5px',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: isMobile ? '0.6rem 0.5rem' : '0.25rem 0.75rem',
            border: 'none',
            borderLeft: opt.value !== options[0].value ? `1px solid ${t.border}` : 'none',
            background: value === opt.value ? t.activeBg : 'transparent',
            color: value === opt.value ? t.activeText : t.textMuted,
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
