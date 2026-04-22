// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedControl, ViewMode } from './SegmentedControl'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')
const options: { value: ViewMode; label: string }[] = [
  { value: 'editor', label: 'Editor' },
  { value: 'both', label: 'Both' },
  { value: 'preview', label: 'Preview' },
]

describe('SegmentedControl', () => {
  it('renders all options', () => {
    render(<SegmentedControl value="both" onChange={() => {}} options={options} theme={theme} />)
    expect(screen.getByText('Editor')).toBeInTheDocument()
    expect(screen.getByText('Both')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('highlights the active option', () => {
    render(<SegmentedControl value="both" onChange={() => {}} options={options} theme={theme} />)
    const bothBtn = screen.getByText('Both')
    expect(bothBtn).toHaveStyle({ background: theme.activeBg })
  })

  it('calls onChange when an option is clicked', async () => {
    const handleChange = vi.fn()
    render(<SegmentedControl value="both" onChange={handleChange} options={options} theme={theme} />)
    await userEvent.click(screen.getByText('Preview'))
    expect(handleChange).toHaveBeenCalledWith('preview')
  })
})
