// Copyright (c) 2026 David Linde. MIT License.
import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView, keymap } from '@codemirror/view'
import { MarkdownToolbar, applyAction } from '../../MarkdownToolbar'
import { Theme } from '../../theme'

const markdownKeymap = keymap.of([
  { key: 'Mod-b', run: (v) => { applyAction(v, { type: 'wrap', before: '**', after: '**', placeholder: 'bold' }); return true } },
  { key: 'Mod-i', run: (v) => { applyAction(v, { type: 'wrap', before: '_', after: '_', placeholder: 'italic' }); return true } },
  { key: 'Mod-k', run: (v) => { applyAction(v, { type: 'wrap', before: '[', after: '](url)', placeholder: 'link text' }); return true } },
])

export function EditorPane({ theme: t, content, editorViewRef, wordCount, charCount, onChange, showBorder, isMobile }: {
  theme: Theme
  content: string
  editorViewRef: React.MutableRefObject<EditorView | null>
  wordCount: number
  charCount: number
  onChange: (v: string) => void
  showBorder: boolean
  isMobile?: boolean
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: showBorder ? `1px solid ${t.border}` : 'none' }}>
      <MarkdownToolbar editorViewRef={editorViewRef} theme={t} isMobile={isMobile} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CodeMirror
          value={content}
          height="100%"
          theme={t.resolved === 'dark' ? 'dark' : 'light'}
          extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), markdownKeymap]}
          onChange={onChange}
          onCreateEditor={(view) => { editorViewRef.current = view }}
          style={{ height: '100%', fontSize: '0.95rem' }}
        />
      </div>
      {!isMobile && (
        <div style={{
          padding: '0.25rem 0.75rem',
          borderTop: `1px solid ${t.border}`,
          background: t.surface,
          fontSize: '0.72rem',
          color: t.textMuted,
          opacity: 0.8,
          flexShrink: 0,
        }}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} chars
        </div>
      )}
    </div>
  )
}
