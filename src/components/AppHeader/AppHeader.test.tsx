// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppHeader } from './AppHeader'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('AppHeader', () => {
  it('logo click fires onLogoClick', async () => {
    const handleLogoClick = vi.fn()
    render(
      <AppHeader
        theme={theme}
        themeMode="system"
        onThemeCycle={() => {}}
        onLogoClick={handleLogoClick}
      />
    )
    await userEvent.click(screen.getByTitle('Open Markdrop README'))
    expect(handleLogoClick).toHaveBeenCalledOnce()
  })

  it('theme button shows correct icon title for system mode', () => {
    render(
      <AppHeader
        theme={theme}
        themeMode="system"
        onThemeCycle={() => {}}
        onLogoClick={() => {}}
      />
    )
    expect(screen.getByTitle('System theme')).toBeInTheDocument()
  })

  it('theme button shows correct icon title for light mode', () => {
    render(
      <AppHeader
        theme={theme}
        themeMode="light"
        onThemeCycle={() => {}}
        onLogoClick={() => {}}
      />
    )
    expect(screen.getByTitle('Light theme')).toBeInTheDocument()
  })

  it('theme click fires onThemeCycle', async () => {
    const handleThemeCycle = vi.fn()
    render(
      <AppHeader
        theme={theme}
        themeMode="light"
        onThemeCycle={handleThemeCycle}
        onLogoClick={() => {}}
      />
    )
    await userEvent.click(screen.getByTitle('Light theme'))
    expect(handleThemeCycle).toHaveBeenCalledOnce()
  })
})
