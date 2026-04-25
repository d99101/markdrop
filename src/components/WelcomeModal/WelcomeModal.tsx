// Copyright (c) 2026 David Linde. MIT License.
import { DragEventHandler, useRef } from 'react'
import { Theme } from '../../theme'
import { Footer } from '../Footer'

export function WelcomeModal({
  theme: t,
  dragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onStartBlank,
  onOpenFile,
}: {
  theme: Theme
  dragging: boolean
  onDrop: DragEventHandler
  onDragOver: DragEventHandler
  onDragLeave: DragEventHandler
  onStartBlank: () => void
  onOpenFile: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="region"
      aria-label="Drop zone"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: t.bg,
        fontFamily: 'system-ui, sans-serif',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            border: dragging ? '2px dashed #4a7fff' : `2px dashed ${t.border}`,
            borderRadius: '12px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            background: dragging ? (t.resolved === 'dark' ? '#1a2a3a' : '#f0f4ff') : t.surface,
            transition: 'border-color 0.15s, background 0.15s',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              marginBottom: '0.5rem',
            }}
          >
            <img src={`${import.meta.env.BASE_URL}icon.svg`} width={36} height={36} alt="" />
            <span
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: t.text,
              }}
            >
              Markdrop
            </span>
          </div>

          <p
            style={{
              color: t.textMuted,
              fontSize: '0.95rem',
              margin: '0 0 1.5rem',
              lineHeight: 1.6,
            }}
          >
            {dragging ? 'Release to open your file' : 'Drag & drop a Markdown file to get started'}
          </p>

          <div
            style={{
              fontSize: '2.5rem',
              marginBottom: '1.5rem',
              opacity: dragging ? 1 : 0.4,
              transition: 'opacity 0.15s',
            }}
          >
            📄
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: t.resolved === 'dark' ? '#1a2a1a' : '#f0fff4',
              border: `1px solid ${t.resolved === 'dark' ? '#2a4a2a' : '#c6f6d5'}`,
              borderRadius: '6px',
              padding: '0.6rem 0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>🔒</span>
            <span style={{ fontSize: '0.8rem', color: t.textMuted, lineHeight: 1.5 }}>
              Your content never leaves your device. Nothing is sent to any server — all storage is
              local to your browser.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
            <input
              ref={inputRef}
              type="file"
              accept=".md,.markdown,.txt"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onOpenFile(file)
                e.target.value = ''
              }}
            />
            <button
              onClick={() => inputRef.current?.click()}
              style={{
                background: t.text,
                color: t.surface,
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Open file
            </button>
            <button
              onClick={onStartBlank}
              style={{
                background: 'none',
                border: `1px solid ${t.border}`,
                borderRadius: '6px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: t.textMuted,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = t.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              Start blank
            </button>
          </div>
        </div>
      </div>

      <Footer theme={t} />
    </div>
  )
}
