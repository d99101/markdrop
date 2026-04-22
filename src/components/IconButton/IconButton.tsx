// Copyright (c) 2026 David Linde. MIT License.
import { useState, CSSProperties, ReactNode } from 'react'
import { Theme } from '../../theme'

export function IconButton({ onClick, title, ariaLabel, theme: t, style, children }: {
  onClick: () => void
  title: string
  ariaLabel?: string
  theme: Theme
  style?: CSSProperties
  children: ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel ?? title}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28,
        border: `1px solid ${t.border}`, borderRadius: '4px',
        background: hovered ? t.hover : 'none',
        cursor: 'pointer', color: t.text,
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  )
}
