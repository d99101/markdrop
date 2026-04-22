// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeModal } from './WelcomeModal'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('WelcomeModal', () => {
  it('renders drag text', () => {
    render(
      <WelcomeModal
        theme={theme}
        dragging={false}
        onDrop={() => {}}
        onDragOver={() => {}}
        onDragLeave={() => {}}
        onStartBlank={() => {}}
      />
    )
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument()
  })

  it('renders "Start with a blank file"', () => {
    render(
      <WelcomeModal
        theme={theme}
        dragging={false}
        onDrop={() => {}}
        onDragOver={() => {}}
        onDragLeave={() => {}}
        onStartBlank={() => {}}
      />
    )
    expect(screen.getByText(/start with a blank file/i)).toBeInTheDocument()
  })

  it('click fires onStartBlank', async () => {
    const handleStartBlank = vi.fn()
    render(
      <WelcomeModal
        theme={theme}
        dragging={false}
        onDrop={() => {}}
        onDragOver={() => {}}
        onDragLeave={() => {}}
        onStartBlank={handleStartBlank}
      />
    )
    await userEvent.click(screen.getByText(/start with a blank file/i))
    expect(handleStartBlank).toHaveBeenCalledOnce()
  })

  it('dragging=true shows different text', () => {
    render(
      <WelcomeModal
        theme={theme}
        dragging={true}
        onDrop={() => {}}
        onDragOver={() => {}}
        onDragLeave={() => {}}
        onStartBlank={() => {}}
      />
    )
    expect(screen.getByText(/release to open/i)).toBeInTheDocument()
  })
})
