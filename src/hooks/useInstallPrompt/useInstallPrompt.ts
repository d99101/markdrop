// Copyright (c) 2026 David Linde. MIT License.
import { useState, useCallback, useEffect } from 'react'
import { useToast } from '../useToast'

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const { state: bannerState, show, dismiss } = useToast(3500)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      show()
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [show])

  const onInstall = useCallback(async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    dismiss()
    setInstallPrompt(null)
  }, [installPrompt, dismiss])

  const onDismiss = useCallback(() => {
    dismiss()
  }, [dismiss])

  return { bannerState, onInstall, onDismiss }
}
