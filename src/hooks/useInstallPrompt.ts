// Copyright (c) 2026 David Linde. MIT License.
import { useState, useCallback, useEffect } from 'react'

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [bannerState, setBannerState] = useState<'hidden' | 'visible' | 'fading'>('hidden')

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setBannerState('visible')
      const fadeTimer = setTimeout(() => setBannerState('fading'), 3500)
      const hideTimer = setTimeout(() => setBannerState('hidden'), 4200)
      return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const onInstall = useCallback(async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    setBannerState('fading')
    setTimeout(() => setBannerState('hidden'), 700)
    setInstallPrompt(null)
  }, [installPrompt])

  const onDismiss = useCallback(() => {
    setBannerState('fading')
    setTimeout(() => setBannerState('hidden'), 700)
  }, [])

  return { bannerState, onInstall, onDismiss }
}
