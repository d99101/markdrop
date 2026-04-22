// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AboutDialog } from './AboutDialog'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('AboutDialog', () => {
  it('renders version and title', () => {
    render(<AboutDialog theme={theme} onClose={() => {}} />)
    expect(screen.getByText('Built with')).toBeInTheDocument()
    expect(screen.getAllByText('Markdrop').length).toBeGreaterThan(0)
  })

  it('clicking backdrop calls onClose', async () => {
    const handleClose = vi.fn()
    const { container } = render(<AboutDialog theme={theme} onClose={handleClose} />)
    // The backdrop is the outermost div (fixed overlay) — click it directly
    const backdrop = container.firstChild as HTMLElement
    await userEvent.click(backdrop)
    expect(handleClose).toHaveBeenCalled()
  })

  it('clicking inner panel does NOT call onClose', async () => {
    const handleClose = vi.fn()
    render(<AboutDialog theme={theme} onClose={handleClose} />)
    const panel = screen.getByText('Built with').closest('[style*="border-radius"]') as HTMLElement
    await userEvent.click(panel!)
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('close button calls onClose', async () => {
    const handleClose = vi.fn()
    render(<AboutDialog theme={theme} onClose={handleClose} />)
    await userEvent.click(screen.getByText('✕'))
    expect(handleClose).toHaveBeenCalled()
  })
})
