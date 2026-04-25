// Copyright (c) 2026 David Linde. MIT License.
import { useRegisterSW } from 'virtual:pwa-register/react'

export function useUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return { needRefresh, update: () => updateServiceWorker(true) }
}
