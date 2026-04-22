// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InstallBanner } from './InstallBanner'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('InstallBanner', () => {
  it('hidden state renders nothing', () => {
    const { container } = render(
      <InstallBanner theme={theme} state="hidden" onInstall={() => {}} onDismiss={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('visible state shows banner', () => {
    render(
      <InstallBanner theme={theme} state="visible" onInstall={() => {}} onDismiss={() => {}} />
    )
    expect(screen.getByText('Install Markdrop app')).toBeInTheDocument()
  })

  it('install click fires onInstall', async () => {
    const handleInstall = vi.fn()
    render(
      <InstallBanner theme={theme} state="visible" onInstall={handleInstall} onDismiss={() => {}} />
    )
    await userEvent.click(screen.getByText('Install'))
    expect(handleInstall).toHaveBeenCalledOnce()
  })

  it('dismiss click fires onDismiss', async () => {
    const handleDismiss = vi.fn()
    render(
      <InstallBanner theme={theme} state="visible" onInstall={() => {}} onDismiss={handleDismiss} />
    )
    await userEvent.click(screen.getByTitle('Dismiss'))
    expect(handleDismiss).toHaveBeenCalledOnce()
  })
})
