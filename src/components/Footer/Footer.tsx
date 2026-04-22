// Copyright (c) 2026 David Linde. MIT License.
import { useState } from 'react'
import { Theme } from '../../theme'
import { AboutDialog } from '../AboutDialog'
import { GitHubIcon } from '../icons'
import pkg from '../../../package.json'

export function Footer({ theme: t }: { theme: Theme }) {
  const [showAbout, setShowAbout] = useState(false)
  const footerBg = t.resolved === 'dark' ? '#1a1a1a' : '#f0f0f0'
  return (
    <>
      {showAbout && <AboutDialog theme={t} onClose={() => setShowAbout(false)} />}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '0.35rem 1rem',
        borderTop: `1px solid ${t.border}`,
        background: footerBg,
        fontSize: '0.75rem',
        color: t.textMuted,
      }}>
        <span>v{pkg.version}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <button
          onClick={() => setShowAbout(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: '0.75rem', padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          About
        </button>
        <span style={{ opacity: 0.4 }}>·</span>
        <a
          href="https://github.com/d99101"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: t.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          <GitHubIcon />
          github.com/d99101
        </a>
      </div>
    </>
  )
}
