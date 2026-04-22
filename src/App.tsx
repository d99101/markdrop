// Copyright (c) 2026 David Linde. MIT License.
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView, keymap } from '@codemirror/view'
import { MarkdownToolbar, applyAction } from './MarkdownToolbar'
import { useTheme } from './useTheme'
import { Theme } from './theme'
import { MARKDROP_README } from './markdropReadme'
import pkg from '../package.json'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

const SESSION_KEY = 'markdrop_content'
const SESSION_FILE_KEY = 'markdrop_filename'

function getInitialContent(): string | null {
  return sessionStorage.getItem(SESSION_KEY)
}

function getInitialFileName() {
  return sessionStorage.getItem(SESSION_FILE_KEY) ?? 'untitled.md'
}

// Sun icon for light mode
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

// Moon icon for dark mode
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

// System/auto icon
const SystemIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const markdownKeymap = keymap.of([
  { key: 'Mod-b', run: (v) => { applyAction(v, { type: 'wrap', before: '**', after: '**', placeholder: 'bold' }); return true } },
  { key: 'Mod-i', run: (v) => { applyAction(v, { type: 'wrap', before: '_', after: '_', placeholder: 'italic' }); return true } },
  { key: 'Mod-k', run: (v) => { applyAction(v, { type: 'wrap', before: '[', after: '](url)', placeholder: 'link text' }); return true } },
])

const THEME_ICONS = { system: <SystemIcon />, light: <SunIcon />, dark: <MoonIcon /> }
const THEME_TITLES = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' }

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function App() {
  const { theme, mode: themeMode, setMode: setThemeMode } = useTheme()
  const isMobile = useIsMobile()

  const [content, setContent] = useState<string | null>(getInitialContent)
  const [fileName, setFileName] = useState<string>(getInitialFileName)
  const [dragging, setDragging] = useState(false)
  const [viewMode, setViewMode] = useState<'editor' | 'both' | 'preview'>('both')
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [installBanner, setInstallBanner] = useState<'hidden' | 'visible' | 'fading'>('hidden')
  const effectiveViewMode = isMobile && viewMode === 'both' ? 'editor' : viewMode
  const editorViewRef = useRef<EditorView | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const syncingRef = useRef(false)
  const contentRef = useRef(content ?? '')

  const wordCount = useMemo(() => {
    const text = content ?? ''
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  }, [content])

  useEffect(() => {
    if (effectiveViewMode !== 'both') return
    const editorScroll = editorViewRef.current?.scrollDOM
    const preview = previewRef.current
    if (!editorScroll || !preview) return

    const onEditorScroll = () => {
      if (syncingRef.current) return
      syncingRef.current = true
      const pct = editorScroll.scrollTop / (editorScroll.scrollHeight - editorScroll.clientHeight || 1)
      preview.scrollTop = pct * (preview.scrollHeight - preview.clientHeight)
      requestAnimationFrame(() => { syncingRef.current = false })
    }
    const onPreviewScroll = () => {
      if (syncingRef.current) return
      syncingRef.current = true
      const pct = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1)
      editorScroll.scrollTop = pct * (editorScroll.scrollHeight - editorScroll.clientHeight)
      requestAnimationFrame(() => { syncingRef.current = false })
    }

    editorScroll.addEventListener('scroll', onEditorScroll)
    preview.addEventListener('scroll', onPreviewScroll)
    return () => {
      editorScroll.removeEventListener('scroll', onEditorScroll)
      preview.removeEventListener('scroll', onPreviewScroll)
    }
  }, [effectiveViewMode])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      setInstallBanner('visible')
      const fadeTimer = setTimeout(() => setInstallBanner('fading'), 3500)
      const hideTimer = setTimeout(() => setInstallBanner('hidden'), 4200)
      return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = useCallback(async () => {
    if (!installPrompt) return
    ;(installPrompt as BeforeInstallPromptEvent).prompt()
    setInstallBanner('fading')
    setTimeout(() => setInstallBanner('hidden'), 700)
    setInstallPrompt(null)
  }, [installPrompt])

  const handleInstallDismiss = useCallback(() => {
    setInstallBanner('fading')
    setTimeout(() => setInstallBanner('hidden'), 700)
  }, [])

  const handleChange = useCallback((value: string) => {
    setContent(value)
    contentRef.current = value
    sessionStorage.setItem(SESSION_KEY, value)
  }, [])

  const loadMarkdropReadme = useCallback(() => {
    contentRef.current = MARKDROP_README
    setContent(MARKDROP_README)
    setFileName('README.md')
    sessionStorage.setItem(SESSION_KEY, MARKDROP_README)
    sessionStorage.setItem(SESSION_FILE_KEY, 'README.md')
  }, [])

  const readFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      contentRef.current = text
      setContent(text)
      setFileName(file.name)
      sessionStorage.setItem(SESSION_KEY, text)
      sessionStorage.setItem(SESSION_FILE_KEY, file.name)
    }
    reader.readAsText(file)
  }, [])

  const startBlank = useCallback(() => {
    const text = ''
    contentRef.current = text
    setContent(text)
    setFileName('untitled.md')
    sessionStorage.setItem(SESSION_KEY, text)
    sessionStorage.setItem(SESSION_FILE_KEY, 'untitled.md')
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) readFile(file)
  }, [readFile])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const cycleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode(theme.resolved === 'dark' ? 'light' : 'dark')
    } else {
      setThemeMode(themeMode === 'light' ? 'dark' : 'light')
    }
  }

  const t = theme

  if (content === null) {
    return (
      <WelcomeModal
        theme={t}
        dragging={dragging}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onStartBlank={startBlank}
      />
    )
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        background: t.bg,
        color: t.text,
        outline: dragging ? '3px dashed #4a7fff' : 'none',
        outlineOffset: '-3px',
        transition: 'outline 0.1s',
      }}
    >
      {/* Header row */}
      <div style={{
        padding: '0.75rem 1rem 0.5rem',
        borderBottom: `1px solid ${t.border}`,
        background: t.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={loadMarkdropReadme}
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
        <IconButton onClick={cycleTheme} title={THEME_TITLES[themeMode]} theme={t}>
          {THEME_ICONS[themeMode]}
        </IconButton>
      </div>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.4rem 1rem',
        borderBottom: `1px solid ${t.border}`,
        background: t.surface,
        fontSize: '0.85rem',
        color: t.textMuted,
      }}>
        <EditableFileName fileName={fileName} onChange={(name) => {
          setFileName(name)
          sessionStorage.setItem(SESSION_FILE_KEY, name)
        }} theme={t} />

        {/* Download */}
        <IconButton
          onClick={() => {
            const blob = new Blob([content ?? ''], { type: 'text/markdown' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            a.click()
            URL.revokeObjectURL(url)
          }}
          title="Download file"
          theme={t}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </IconButton>

        <span style={{ width: 1, height: 20, background: t.border, flexShrink: 0 }} />

        <SegmentedControl value={effectiveViewMode} onChange={setViewMode} theme={t} options={isMobile ? [
          { value: 'editor', label: 'Edit' },
          { value: 'preview', label: 'Preview' },
        ] : [
          { value: 'editor', label: 'Editor' },
          { value: 'both', label: 'Both' },
          { value: 'preview', label: 'Preview' },
        ]} />

      </div>

      {/* Panes */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* Editor column */}
        {(effectiveViewMode === 'editor' || effectiveViewMode === 'both') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: effectiveViewMode === 'both' ? `1px solid ${t.border}` : 'none' }}>
            <MarkdownToolbar editorViewRef={editorViewRef} theme={t} />
            <div style={{ flex: 1, overflow: 'auto' }}>
              <CodeMirror
                value={content ?? ''}
                height="100%"
                theme={t.resolved === 'dark' ? 'dark' : 'light'}
                extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), markdownKeymap]}
                onChange={handleChange}
                onCreateEditor={(view) => { editorViewRef.current = view }}
                style={{ height: '100%', fontSize: '0.95rem' }}
              />
            </div>
            <div style={{
              padding: '0.25rem 0.75rem',
              borderTop: `1px solid ${t.border}`,
              background: t.surface,
              fontSize: '0.72rem',
              color: t.textMuted,
              opacity: 0.8,
              flexShrink: 0,
            }}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'} · {(content ?? '').length} chars
            </div>
          </div>
        )}

        {/* Preview column */}
        {(effectiveViewMode === 'preview' || effectiveViewMode === 'both') && (
          <div ref={previewRef} style={{ flex: 1, padding: '1rem 2rem', overflowY: 'auto', lineHeight: 1.7, background: t.bg, color: t.text }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      style={t.resolved === 'dark' ? oneDark : oneLight}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} style={{
                      background: t.inlineCodeBg,
                      color: t.inlineCodeText,
                      padding: '0.3em 0.65em',
                      borderRadius: '4px',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: '0.875em',
                      border: `1px solid ${t.inlineCodeBorder}`,
                      display: 'inline-block',
                      lineHeight: 1.5,
                    }}>
                      {children}
                    </code>
                  )
                },
                table: ({ children }) => (
                  <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1rem' }}>{children}</table>
                ),
                th: ({ children }) => (
                  <th style={{ border: `1px solid ${t.border}`, padding: '0.5rem 0.75rem', background: t.tableHeaderBg, textAlign: 'left', color: t.text }}>{children}</th>
                ),
                td: ({ children }) => (
                  <td style={{ border: `1px solid ${t.border}`, padding: '0.5rem 0.75rem', color: t.text }}>{children}</td>
                ),
                p: ({ children }) => <p style={{ color: t.text }}>{children}</p>,
                h1: ({ children }) => <h1 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '0.3rem' }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '0.2rem' }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ color: t.text }}>{children}</h3>,
                a: ({ children, href }) => <a href={href} style={{ color: t.resolved === 'dark' ? '#58a6ff' : '#0969da' }}>{children}</a>,
                blockquote: ({ children }) => (
                  <blockquote style={{ borderLeft: `4px solid ${t.border}`, margin: '0', paddingLeft: '1rem', color: t.textMuted }}>{children}</blockquote>
                ),
                hr: () => <hr style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '1.5rem 0' }} />,
                li: ({ children }) => <li style={{ color: t.text }}>{children}</li>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <Footer theme={t} />

      {installBanner !== 'hidden' && (
        <div style={{
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
          opacity: installBanner === 'visible' ? 1 : 0,
          transition: 'opacity 0.6s ease',
          whiteSpace: 'nowrap',
        }}>
          <img src={`${import.meta.env.BASE_URL}icon.svg`} width={20} height={20} alt="" />
          <span>Install Markdrop app</span>
          <button
            onClick={handleInstallClick}
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
            onClick={handleInstallDismiss}
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
      )}
    </div>
  )
}

function IconButton({ onClick, title, theme: t, style, children }: {
  onClick: () => void
  title: string
  theme: Theme
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
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

function WelcomeModal({ theme: t, dragging, onDrop, onDragOver, onDragLeave, onStartBlank }: {
  theme: Theme
  dragging: boolean
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onStartBlank: () => void
}) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
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
      <div style={{
        width: '100%',
        maxWidth: 440,
        border: dragging ? '2px dashed #4a7fff' : `2px dashed ${t.border}`,
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        background: dragging ? (t.resolved === 'dark' ? '#1a2a3a' : '#f0f4ff') : t.surface,
        transition: 'border-color 0.15s, background 0.15s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <img src={`${import.meta.env.BASE_URL}icon.svg`} width={36} height={36} alt="" />
          <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: t.text }}>Markdrop</span>
        </div>

        <p style={{ color: t.textMuted, fontSize: '0.95rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
          {dragging ? 'Release to open your file' : 'Drag & drop a Markdown file to get started'}
        </p>

        <div style={{
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          opacity: dragging ? 1 : 0.4,
          transition: 'opacity 0.15s',
        }}>
          📄
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: t.resolved === 'dark' ? '#1a2a1a' : '#f0fff4',
          border: `1px solid ${t.resolved === 'dark' ? '#2a4a2a' : '#c6f6d5'}`,
          borderRadius: '6px',
          padding: '0.6rem 0.9rem',
          marginBottom: '1.5rem',
          textAlign: 'left',
        }}>
          <span style={{ fontSize: '0.9rem' }}>🔒</span>
          <span style={{ fontSize: '0.8rem', color: t.textMuted, lineHeight: 1.5 }}>
            Your content never leaves your device. Nothing is sent to any server — all storage is local to your browser.
          </span>
        </div>

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
          onMouseEnter={e => (e.currentTarget.style.background = t.hover)}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          Start with a blank file
        </button>
      </div>
      </div>

      <Footer theme={t} />
    </div>
  )
}

function EditableFileName({ fileName, onChange, theme: t }: {
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

type ViewMode = 'editor' | 'both' | 'preview'

function SegmentedControl({ value, onChange, options, theme: t }: {
  value: ViewMode
  onChange: (v: ViewMode) => void
  options: { value: ViewMode; label: string }[]
  theme: Theme
}) {
  return (
    <div style={{ display: 'flex', border: `1px solid ${t.border}`, borderRadius: '5px', overflow: 'hidden' }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '0.25rem 0.75rem',
            border: 'none',
            borderLeft: opt.value !== options[0].value ? `1px solid ${t.border}` : 'none',
            background: value === opt.value ? t.activeBg : 'transparent',
            color: value === opt.value ? t.activeText : t.textMuted,
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
  </svg>
)

function AboutDialog({ theme: t, onClose }: { theme: Theme; onClose: () => void }) {
  const stack = [
    { name: 'React 19', desc: 'UI framework' },
    { name: 'TypeScript', desc: 'Type safety' },
    { name: 'Vite 6', desc: 'Build tool & dev server' },
    { name: 'CodeMirror 6', desc: 'Code editor engine' },
    { name: 'react-markdown', desc: 'Markdown rendering' },
    { name: 'remark-gfm', desc: 'GitHub Flavored Markdown' },
    { name: 'react-syntax-highlighter', desc: 'Code block highlighting' },
  ]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: '10px',
          padding: '1.75rem',
          fontFamily: 'system-ui, sans-serif',
          color: t.text,
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: t.textMuted, fontSize: '1.1rem', lineHeight: 1, padding: '0.2rem',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = t.text)}
          onMouseLeave={e => (e.currentTarget.style.color = t.textMuted)}
        >
          ✕
        </button>

        <div style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Markdrop
        </div>
        <div style={{ fontSize: '0.8rem', color: t.textMuted, marginBottom: '1.25rem' }}>
          v{pkg.version} — browser-based Markdown editor
        </div>

        <p style={{ fontSize: '0.875rem', color: t.textMuted, lineHeight: 1.6, margin: '0 0 1.25rem' }}>
          Minimal, private, offline-first. Drop a file, edit, preview. No accounts, no uploads — everything stays in your browser.
        </p>

        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.textMuted, marginBottom: '0.6rem' }}>
          Built with
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.5rem' }}>
          {stack.map(({ name, desc }) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: t.text }}>{name}</span>
              <span style={{ color: t.textMuted }}>{desc}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <GitHubIcon />
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: t.text, fontWeight: 500 }}>David Linde</span>
            <span style={{ color: t.textMuted }}> · </span>
            <a
              href="https://github.com/d99101"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: t.resolved === 'dark' ? '#58a6ff' : '#0969da', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              github.com/d99101
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer({ theme: t }: { theme: Theme }) {
  const [showAbout, setShowAbout] = useState(false)
  const footerBg = t.resolved === 'dark' ? '#1a1a1a' : '#f0f0f0'
  return (
    <>
      {showAbout && <AboutDialog theme={t} onClose={() => setShowAbout(false)} />}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '0.35rem 1rem',
        borderTop: `1px solid ${t.border}`,
        background: footerBg,
        fontSize: '0.75rem',
        color: t.textMuted,
      }}>
        <span>v{pkg.version}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <button
          onClick={() => setShowAbout(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: '0.75rem', padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          About
        </button>
        <span style={{ opacity: 0.4 }}>·</span>
        <a
          href="https://github.com/d99101"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: t.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          <GitHubIcon />
          github.com/d99101
        </a>
      </div>
    </>
  )
}

export default App
