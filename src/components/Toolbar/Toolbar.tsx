// Copyright (c) 2026 David Linde. MIT License.
import { useRef } from 'react'
import { Theme } from '../../theme'
import { EditableFileName } from '../EditableFileName'
import { IconButton } from '../IconButton'
import { SegmentedControl, ViewMode } from '../SegmentedControl'

export function Toolbar({
  theme: t,
  fileName,
  onFileNameChange,
  onDownload,
  onReset,
  onOpenFile,
  viewMode,
  onViewModeChange,
  isMobile,
}: {
  theme: Theme
  fileName: string
  onFileNameChange: (name: string) => void
  onDownload: () => void
  onReset: () => void
  onOpenFile: (file: File) => void
  viewMode: ViewMode
  onViewModeChange: (v: ViewMode) => void
  isMobile: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: isMobile ? '0.5rem 1rem' : '0.4rem 1rem',
        borderBottom: `1px solid ${t.border}`,
        background: t.surface,
        fontSize: '0.85rem',
        color: t.textMuted,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onOpenFile(file)
          e.target.value = ''
        }}
      />
      <EditableFileName fileName={fileName} onChange={onFileNameChange} theme={t} />

      <IconButton onClick={onReset} title="New file" theme={t} isMobile={isMobile}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </IconButton>

      {isMobile && (
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          title="Open file"
          theme={t}
          isMobile={isMobile}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </IconButton>
      )}

      <IconButton onClick={onDownload} title="Download file" theme={t} isMobile={isMobile}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </IconButton>

      <span style={{ width: 1, height: isMobile ? 28 : 20, background: t.border, flexShrink: 0 }} />

      <SegmentedControl
        value={viewMode}
        onChange={onViewModeChange}
        theme={t}
        isMobile={isMobile}
        options={
          isMobile
            ? [
                { value: 'editor', label: 'Edit' },
                { value: 'preview', label: 'Preview' },
              ]
            : [
                { value: 'editor', label: 'Editor' },
                { value: 'both', label: 'Both' },
                { value: 'preview', label: 'Preview' },
              ]
        }
      />
    </div>
  )
}
