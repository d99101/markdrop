// Copyright (c) 2026 David Linde. MIT License.
import { RefObject, ReactNode } from 'react'
import { EditorView } from '@codemirror/view'
import { Theme } from './theme'
import { type Action, applyAction } from './markdownActions'

const LinkIcon = () => (
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
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const ImageIcon = () => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const TOOLS: (
  | { label: ReactNode; styleLabel?: string; title: string; action: Action }
  | 'divider'
)[] = [
  {
    label: 'H1',
    title: 'Heading 1',
    action: { type: 'prefix', prefix: '# ', placeholder: 'Heading' },
  },
  {
    label: 'H2',
    title: 'Heading 2',
    action: { type: 'prefix', prefix: '## ', placeholder: 'Heading' },
  },
  {
    label: 'H3',
    title: 'Heading 3',
    action: { type: 'prefix', prefix: '### ', placeholder: 'Heading' },
  },
  'divider',
  {
    label: 'B',
    styleLabel: 'B',
    title: 'Bold',
    action: { type: 'wrap', before: '**', after: '**', placeholder: 'bold' },
  },
  {
    label: 'I',
    styleLabel: 'I',
    title: 'Italic',
    action: { type: 'wrap', before: '_', after: '_', placeholder: 'italic' },
  },
  {
    label: 'S',
    styleLabel: 'S',
    title: 'Strikethrough',
    action: { type: 'wrap', before: '~~', after: '~~', placeholder: 'text' },
  },
  'divider',
  {
    label: '`',
    title: 'Inline code',
    action: { type: 'wrap', before: '`', after: '`', placeholder: 'code' },
  },
  {
    label: '</>',
    title: 'Code block',
    action: { type: 'wrap', before: '```\n', after: '\n```', placeholder: 'code' },
  },
  'divider',
  {
    label: <LinkIcon />,
    title: 'Link',
    action: { type: 'wrap', before: '[', after: '](url)', placeholder: 'link text' },
  },
  {
    label: <ImageIcon />,
    title: 'Image',
    action: { type: 'wrap', before: '![', after: '](url)', placeholder: 'alt text' },
  },
  'divider',
  {
    label: '>',
    title: 'Blockquote',
    action: { type: 'prefix', prefix: '> ', placeholder: 'quote' },
  },
  {
    label: '•',
    title: 'Bullet list',
    action: { type: 'prefix', prefix: '- ', placeholder: 'item' },
  },
  {
    label: '1.',
    title: 'Ordered list',
    action: { type: 'prefix', prefix: '1. ', placeholder: 'item' },
  },
  {
    label: '☐',
    title: 'Task list',
    action: { type: 'prefix', prefix: '- [ ] ', placeholder: 'task' },
  },
  'divider',
  { label: '—', title: 'Horizontal rule', action: { type: 'insert', text: '\n---\n' } },
  {
    label: '⊞',
    title: 'Table',
    action: {
      type: 'insert',
      text: '| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n',
    },
  },
]

export function MarkdownToolbar({
  editorViewRef,
  theme,
  isMobile,
}: {
  editorViewRef: RefObject<EditorView | null>
  theme: Theme
  isMobile?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: isMobile ? '0.4rem 0.75rem' : '0.3rem 0.75rem',
        borderBottom: `1px solid ${theme.border}`,
        background: theme.surface,
        flexWrap: 'wrap',
      }}
    >
      {TOOLS.map((tool, i) => {
        if (tool === 'divider') {
          return (
            <span
              key={i}
              style={{
                width: 1,
                height: isMobile ? 28 : 18,
                background: theme.border,
                margin: '0 4px',
              }}
            />
          )
        }
        const s = tool.styleLabel
        return (
          <button
            key={i}
            title={tool.title}
            onMouseDown={(e) => {
              e.preventDefault()
              const view = editorViewRef.current
              if (view) applyAction(view, tool.action)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '0.5rem 0.65rem' : '0.2rem 0.45rem',
              border: '1px solid transparent',
              borderRadius: '4px',
              background: 'none',
              cursor: 'pointer',
              fontSize: isMobile ? '1rem' : '0.85rem',
              fontWeight: s === 'B' ? 700 : 400,
              fontStyle: s === 'I' ? 'italic' : 'normal',
              textDecoration: s === 'S' ? 'line-through' : 'none',
              color: theme.text,
              lineHeight: 1,
              minWidth: isMobile ? 44 : 24,
              minHeight: isMobile ? 44 : 24,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            {tool.label}
          </button>
        )
      })}
    </div>
  )
}
