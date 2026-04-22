// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('ConfirmDialog', () => {
  it('renders message text', () => {
    render(
      <ConfirmDialog theme={theme} message="Are you sure?" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('confirm button calls onConfirm', async () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        theme={theme}
        message="Confirm this action"
        confirmLabel="Yes"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    )
    await userEvent.click(screen.getByText('Yes'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('cancel button calls onCancel', async () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        theme={theme}
        message="Confirm this action"
        cancelLabel="No"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    )
    await userEvent.click(screen.getByText('No'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('backdrop click calls onCancel', async () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        theme={theme}
        message="Click backdrop"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    )
    // The backdrop is the fixed overlay div behind the dialog panel
    const backdrop = screen.getByText('Click backdrop').closest('[role="dialog"]')!.parentElement!
    await userEvent.click(backdrop)
    expect(onCancel).toHaveBeenCalled()
  })

  it('Escape key calls onCancel', async () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog theme={theme} message="Press escape" onConfirm={vi.fn()} onCancel={onCancel} />
    )
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
