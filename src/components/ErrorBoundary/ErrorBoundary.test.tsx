// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

function GoodChild() {
  return <div>All good</div>
}

function BadChild(): never {
  throw new Error('Test error message')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress React's error output for expected errors
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary theme={theme}>
        <GoodChild />
      </ErrorBoundary>
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders fallback when child throws', () => {
    render(
      <ErrorBoundary theme={theme}>
        <BadChild />
      </ErrorBoundary>
    )
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })
})
