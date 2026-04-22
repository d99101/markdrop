// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toolbar } from './Toolbar'
import { buildTheme } from '../theme'

const theme = buildTheme('light')

describe('Toolbar', () => {
  it('download button click fires onDownload', async () => {
    const handleDownload = vi.fn()
    render(
      <Toolbar
        theme={theme}
        fileName="test.md"
        onFileNameChange={() => {}}
        onDownload={handleDownload}
        onReset={() => {}}
        viewMode="both"
        onViewModeChange={() => {}}
        isMobile={false}
      />
    )
    await userEvent.click(screen.getByTitle('Download file'))
    expect(handleDownload).toHaveBeenCalledOnce()
  })

  it('view mode change fires onViewModeChange', async () => {
    const handleViewModeChange = vi.fn()
    render(
      <Toolbar
        theme={theme}
        fileName="test.md"
        onFileNameChange={() => {}}
        onDownload={() => {}}
        onReset={() => {}}
        viewMode="both"
        onViewModeChange={handleViewModeChange}
        isMobile={false}
      />
    )
    await userEvent.click(screen.getByText('Preview'))
    expect(handleViewModeChange).toHaveBeenCalledWith('preview')
  })
})
