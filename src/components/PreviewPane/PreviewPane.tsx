// Copyright (c) 2026 David Linde. MIT License.
import React, { lazy, Suspense, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Theme } from '../../theme'

const SyntaxHighlighter = lazy(() =>
  import('react-syntax-highlighter').then(m => ({ default: m.Prism as any }))
)

function buildMarkdownComponents(t: Theme): React.ComponentProps<typeof ReactMarkdown>['components'] {
  return {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return match ? (
        <Suspense fallback={<code>{children}</code>}>
          <SyntaxHighlighter
            style={t.resolved === 'dark' ? oneDark : oneLight}
            language={match[1]}
            PreTag="div"
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </Suspense>
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
  }
}

export const PreviewPane = React.memo(function PreviewPane({ theme: t, content, previewRef }: {
  theme: Theme
  content: string
  previewRef: React.RefObject<HTMLDivElement | null>
}) {
  const components = useMemo(() => buildMarkdownComponents(t), [t])

  return (
    <div ref={previewRef} style={{ flex: 1, padding: '1rem 2rem', overflowY: 'auto', lineHeight: 1.7, background: t.bg, color: t.text }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})
