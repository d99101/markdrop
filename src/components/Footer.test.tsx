// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Footer } from './Footer'
import { buildTheme } from '../theme'

const theme = buildTheme('light')

describe('Footer', () => {
  it('renders version', () => {
    render(<Footer theme={theme} />)
    // version string starts with 'v'
    expect(screen.getByText(/^v\d/)).toBeInTheDocument()
  })

  it('clicking About shows AboutDialog', async () => {
    render(<Footer theme={theme} />)
    await userEvent.click(screen.getByText('About'))
    expect(screen.getByText('Built with')).toBeInTheDocument()
  })
})
