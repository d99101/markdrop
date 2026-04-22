// Copyright (c) 2026 David Linde. MIT License.
import { ReactNode, useEffect, useRef } from 'react'
import { Theme } from '../../theme'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function Dialog({ theme: t, onClose, children, maxWidth = 420 }: {
  theme: Theme
  onClose: () => void
  children: ReactNode
  maxWidth?: number
}) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Focus first focusable child on mount
    const el = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    el?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth,
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: '10px',
          padding: '1.5rem',
          fontFamily: 'system-ui, sans-serif',
          color: t.text,
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  )
}
