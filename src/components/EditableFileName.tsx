// Copyright (c) 2026 David Linde. MIT License.
import { useState } from 'react'
import { Theme } from '../theme'

export function EditableFileName({ fileName, onChange, theme: t }: {
  fileName: string
  onChange: (name: string) => void
  theme: Theme
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(fileName)

  const commit = () => {
    const trimmed = draft.trim() || fileName
    setDraft(trimmed)
    onChange(trimmed)
    setEditing(false)
  }

  const start = () => {
    setDraft(fileName)
    setEditing(true)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setDraft(fileName); setEditing(false) }
        }}
        style={{
          flex: 1,
          background: t.bg,
          color: t.text,
          border: `1px solid ${t.border}`,
          borderRadius: '4px',
          padding: '0.1rem 0.4rem',
          fontSize: '0.85rem',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
    )
  }

  return (
    <span
      onClick={start}
      title="Click to rename"
      style={{
        flex: 1,
        cursor: 'text',
        borderRadius: '4px',
        padding: '0.1rem 0.4rem',
        color: t.textMuted,
        fontSize: '0.85rem',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = t.hover)}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {fileName}
    </span>
  )
}
