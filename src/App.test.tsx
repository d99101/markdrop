import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
})

describe('App', () => {
  it('shows welcome screen on first load', () => {
    render(<App />)
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument()
  })

  it('welcome screen has start blank button', () => {
    render(<App />)
    expect(screen.getByText(/start with a blank file/i)).toBeInTheDocument()
  })

  it('clicking start blank shows editor', async () => {
    render(<App />)
    await userEvent.click(screen.getByText(/start with a blank file/i))
    expect(screen.getByText('Markdrop')).toBeInTheDocument()
  })

  it('restores content from sessionStorage', () => {
    sessionStorage.setItem('markdrop_content', '# Restored')
    render(<App />)
    expect(screen.queryByText(/drag & drop/i)).not.toBeInTheDocument()
  })

  it('shows about dialog when About is clicked', async () => {
    sessionStorage.setItem('markdrop_content', '')
    render(<App />)
    await userEvent.click(screen.getByText('About'))
    expect(screen.getByText('Built with')).toBeInTheDocument()
  })

  it('shows nothing-to-download toast when content is empty and download clicked', async () => {
    sessionStorage.setItem('markdrop_content', '   ')
    render(<App />)
    const downloadBtn = screen.getByTitle(/download/i)
    await userEvent.click(downloadBtn)
    expect(screen.getByText(/nothing to download/i)).toBeInTheDocument()
  })
})
