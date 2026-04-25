// Copyright (c) 2026 David Linde. MIT License.
import { Theme } from '../../theme'

export type ViewMode = 'editor' | 'both' | 'preview'

const icons: Record<ViewMode, React.ReactNode> = {
  editor: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  both: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  preview: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
}

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
          title={opt.label}
          style={{
            flex: 1,
            width: isMobile ? 44 : undefined,
            height: isMobile ? 44 : undefined,
            minWidth: isMobile ? 44 : 0,
            padding: isMobile ? 0 : '0.25rem 0.65rem',
            border: 'none',
            borderLeft: opt.value !== options[0].value ? `1px solid ${t.border}` : 'none',
            background: value === opt.value ? t.activeBg : 'transparent',
            color: value === opt.value ? t.activeText : t.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icons[opt.value]}
        </button>
      ))}
    </div>
  )
}
