// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './IconButton'
import { buildTheme } from '../theme'

const theme = buildTheme('light')

describe('IconButton', () => {
  it('renders with title', () => {
    render(
      <IconButton onClick={() => {}} title="Test button" theme={theme}>
        <span>icon</span>
      </IconButton>
    )
    expect(screen.getByTitle('Test button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(
      <IconButton onClick={handleClick} title="Clickable" theme={theme}>
        <span>icon</span>
      </IconButton>
    )
    await userEvent.click(screen.getByTitle('Clickable'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
