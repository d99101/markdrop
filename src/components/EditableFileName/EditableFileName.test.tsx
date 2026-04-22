// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditableFileName } from './EditableFileName'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('EditableFileName', () => {
  it('renders the filename', () => {
    render(<EditableFileName fileName="notes.md" onChange={() => {}} theme={theme} />)
    expect(screen.getByText('notes.md')).toBeInTheDocument()
  })

  it('click enters edit mode', async () => {
    render(<EditableFileName fileName="notes.md" onChange={() => {}} theme={theme} />)
    await userEvent.click(screen.getByText('notes.md'))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('Enter commits new name', async () => {
    const handleChange = vi.fn()
    render(<EditableFileName fileName="notes.md" onChange={handleChange} theme={theme} />)
    await userEvent.click(screen.getByText('notes.md'))
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'new-name.md')
    await userEvent.keyboard('{Enter}')
    expect(handleChange).toHaveBeenCalledWith('new-name.md')
  })

  it('Escape cancels edit', async () => {
    const handleChange = vi.fn()
    render(<EditableFileName fileName="notes.md" onChange={handleChange} theme={theme} />)
    await userEvent.click(screen.getByText('notes.md'))
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'changed.md')
    await userEvent.keyboard('{Escape}')
    expect(handleChange).not.toHaveBeenCalled()
    expect(screen.getByText('notes.md')).toBeInTheDocument()
  })

  it('blur commits the name', async () => {
    const handleChange = vi.fn()
    render(<EditableFileName fileName="notes.md" onChange={handleChange} theme={theme} />)
    await userEvent.click(screen.getByText('notes.md'))
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'blurred.md')
    await userEvent.tab()
    expect(handleChange).toHaveBeenCalledWith('blurred.md')
  })

  it('empty input falls back to original filename', async () => {
    const handleChange = vi.fn()
    render(<EditableFileName fileName="notes.md" onChange={handleChange} theme={theme} />)
    await userEvent.click(screen.getByText('notes.md'))
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.keyboard('{Enter}')
    expect(handleChange).toHaveBeenCalledWith('notes.md')
  })
})
