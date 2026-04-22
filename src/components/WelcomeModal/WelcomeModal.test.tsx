// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeModal } from './WelcomeModal'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')
const noop = () => {}
const defaultProps = {
  theme,
  dragging: false,
  onDrop: noop,
  onDragOver: noop,
  onDragLeave: noop,
  onStartBlank: noop,
  onOpenFile: noop,
}

describe('WelcomeModal', () => {
  it('renders drag text', () => {
    render(<WelcomeModal {...defaultProps} />)
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument()
  })

  it('renders "Start blank" button', () => {
    render(<WelcomeModal {...defaultProps} />)
    expect(screen.getByText(/start blank/i)).toBeInTheDocument()
  })

  it('renders "Open file" button', () => {
    render(<WelcomeModal {...defaultProps} />)
    expect(screen.getByText(/open file/i)).toBeInTheDocument()
  })

  it('click fires onStartBlank', async () => {
    const handleStartBlank = vi.fn()
    render(<WelcomeModal {...defaultProps} onStartBlank={handleStartBlank} />)
    await userEvent.click(screen.getByText(/start blank/i))
    expect(handleStartBlank).toHaveBeenCalledOnce()
  })

  it('dragging=true shows different text', () => {
    render(<WelcomeModal {...defaultProps} dragging={true} />)
    expect(screen.getByText(/release to open/i)).toBeInTheDocument()
  })
})
