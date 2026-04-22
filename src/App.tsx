// Copyright (c) 2026 David Linde. MIT License.
import { useState, useRef, useMemo } from 'react'
import { EditorView } from '@codemirror/view'
import { useTheme } from './useTheme'
import { useIsMobile } from './hooks/useIsMobile'
import { useDocument } from './hooks/useDocument'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { useScrollSync } from './hooks/useScrollSync'
import { useDragDrop } from './hooks/useDragDrop'
import { useToast } from './hooks/useToast'
import { AppHeader } from './components/AppHeader'
import { Toolbar } from './components/Toolbar'
import { EditorPane } from './components/EditorPane'
import { PreviewPane } from './components/PreviewPane'
import { Footer } from './components/Footer'
import { WelcomeModal } from './components/WelcomeModal'
import { InstallBanner } from './components/InstallBanner'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ErrorBoundary } from './components/ErrorBoundary'
import type { ViewMode } from './components/SegmentedControl'

function App() {
  const { theme, mode: themeMode, setMode: setThemeMode } = useTheme()
  const isMobile = useIsMobile()
  const {
    content,
    fileName,
    handleChange,
    handleFileNameChange,
    loadMarkdropReadme,
    readFile,
    startBlank,
  } = useDocument()
  const { bannerState, onInstall, onDismiss } = useInstallPrompt()
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const handleFileDrop = (file: File) => {
    if (content !== null && content.trim()) {
      setPendingFile(file)
    } else {
      readFile(file)
    }
  }
  const { dragging, onDrop, onDragOver, onDragLeave } = useDragDrop(handleFileDrop)
  const emptyHint = useToast(2000)

  const [viewMode, setViewMode] = useState<ViewMode>('both')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const editorViewRef = useRef<EditorView | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const effectiveViewMode: ViewMode = isMobile && viewMode === 'both' ? 'editor' : viewMode

  const wordCount = useMemo(() => {
    const text = content ?? ''
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  }, [content])

  useScrollSync(effectiveViewMode, editorViewRef, previewRef)

  const cycleTheme = () => {
    if (themeMode === 'system') setThemeMode(theme.resolved === 'dark' ? 'light' : 'dark')
    else setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }

  const handleDownload = () => {
    if (!content?.trim()) {
      emptyHint.show()
      return
    }
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
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
        onOpenFile={readFile}
      />
    )
  }

  return (
    <div
      className={t.resolved === 'dark' ? 'dark-scrollbar' : undefined}
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
      <AppHeader
        theme={t}
        themeMode={themeMode}
        onThemeCycle={cycleTheme}
        onLogoClick={loadMarkdropReadme}
        isMobile={isMobile}
      />
      <Toolbar
        theme={t}
        fileName={fileName}
        onFileNameChange={handleFileNameChange}
        onDownload={handleDownload}
        onReset={() => setShowResetConfirm(true)}
        onOpenFile={handleFileDrop}
        viewMode={effectiveViewMode}
        onViewModeChange={setViewMode}
        isMobile={isMobile}
      />
      {showResetConfirm && (
        <ConfirmDialog
          theme={t}
          message="Start a new file? Any unsaved content will be lost."
          confirmLabel="New file"
          cancelLabel="Cancel"
          onConfirm={() => {
            setShowResetConfirm(false)
            startBlank()
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
      {pendingFile && (
        <ConfirmDialog
          theme={t}
          message={`Replace current file with "${pendingFile.name}"? Unsaved content will be lost.`}
          confirmLabel="Replace"
          cancelLabel="Cancel"
          onConfirm={() => {
            readFile(pendingFile)
            setPendingFile(null)
          }}
          onCancel={() => setPendingFile(null)}
        />
      )}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {(effectiveViewMode === 'editor' || effectiveViewMode === 'both') && (
          <ErrorBoundary theme={t}>
            <EditorPane
              theme={t}
              content={content}
              editorViewRef={editorViewRef}
              wordCount={wordCount}
              charCount={(content ?? '').length}
              onChange={handleChange}
              showBorder={effectiveViewMode === 'both'}
              isMobile={isMobile}
            />
          </ErrorBoundary>
        )}
        {(effectiveViewMode === 'preview' || effectiveViewMode === 'both') && (
          <ErrorBoundary theme={t}>
            <PreviewPane theme={t} content={content} previewRef={previewRef} />
          </ErrorBoundary>
        )}
      </div>
      <Footer
        theme={t}
        wordCount={isMobile ? wordCount : undefined}
        charCount={isMobile ? (content ?? '').length : undefined}
      />
      <InstallBanner theme={t} state={bannerState} onInstall={onInstall} onDismiss={onDismiss} />
      {emptyHint.state !== 'hidden' && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            padding: '0.55rem 1rem',
            fontSize: '0.82rem',
            color: t.textMuted,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 1000,
            opacity: emptyHint.state === 'visible' ? 1 : 0,
            transition: 'opacity 0.6s ease',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Nothing to download — file is empty
        </div>
      )}
    </div>
  )
}

export default App
