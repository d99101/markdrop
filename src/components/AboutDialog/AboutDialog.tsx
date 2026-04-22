// Copyright (c) 2026 David Linde. MIT License.
import { Theme } from '../../theme'
import { GitHubIcon } from '../icons'
import { Dialog } from '../Dialog'
import pkg from '../../../package.json'

export function AboutDialog({ theme: t, onClose }: { theme: Theme; onClose: () => void }) {
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
    <Dialog theme={t} onClose={onClose} maxWidth={420}>
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
    </Dialog>
  )
}
