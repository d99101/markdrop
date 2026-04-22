// Copyright (c) 2026 David Linde. MIT License.
import { Component, ReactNode } from 'react'
import { Theme } from '../../theme'

interface Props {
  children: ReactNode
  theme: Theme
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    const { error } = this.state
    const { theme: t, children } = this.props
    if (error) {
      return (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: t.bg,
          color: t.text,
        }}>
          <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            Something went wrong. Refresh to recover.
          </p>
          <pre style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: t.textMuted,
            maxWidth: '600px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {error.message}
          </pre>
        </div>
      )
    }
    return children
  }
}
