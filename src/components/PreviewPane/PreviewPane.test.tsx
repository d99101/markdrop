// Copyright (c) 2026 David Linde. MIT License.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { PreviewPane } from './PreviewPane'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('PreviewPane', () => {
  it('renders markdown content as HTML', async () => {
    const ref = createRef<HTMLDivElement>()
    render(<PreviewPane theme={theme} content="# Hello World" previewRef={ref} />)
    const heading = await screen.findByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Hello World')
  })
})
