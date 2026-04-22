// Copyright (c) 2026 David Linde. MIT License.
import { useState, useCallback, useRef } from 'react'
import { MARKDROP_README } from '../../markdropReadme'

export const SESSION_KEY = 'markdrop_content'
export const SESSION_FILE_KEY = 'markdrop_filename'

function getInitialContent(): string | null {
  return sessionStorage.getItem(SESSION_KEY)
}

function getInitialFileName(): string {
  return sessionStorage.getItem(SESSION_FILE_KEY) ?? 'untitled.md'
}

export function useDocument() {
  const [content, setContent] = useState<string | null>(getInitialContent)
  const [fileName, setFileName] = useState<string>(getInitialFileName)
  const sessionSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback((value: string) => {
    setContent(value)
    if (sessionSaveTimer.current) clearTimeout(sessionSaveTimer.current)
    sessionSaveTimer.current = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, value)
    }, 500)
  }, [])

  const handleFileNameChange = useCallback((name: string) => {
    setFileName(name)
    sessionStorage.setItem(SESSION_FILE_KEY, name)
  }, [])

  const loadMarkdropReadme = useCallback(() => {
    setContent(MARKDROP_README)
    setFileName('README.md')
    sessionStorage.setItem(SESSION_KEY, MARKDROP_README)
    sessionStorage.setItem(SESSION_FILE_KEY, 'README.md')
  }, [])

  const readFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setContent(text)
      setFileName(file.name)
      sessionStorage.setItem(SESSION_KEY, text)
      sessionStorage.setItem(SESSION_FILE_KEY, file.name)
    }
    reader.onerror = () => console.error('Failed to read file')
    reader.readAsText(file)
  }, [])

  const startBlank = useCallback(() => {
    setContent('')
    setFileName('untitled.md')
    sessionStorage.setItem(SESSION_KEY, '')
    sessionStorage.setItem(SESSION_FILE_KEY, 'untitled.md')
  }, [])

  return {
    content,
    fileName,
    handleChange,
    handleFileNameChange,
    loadMarkdropReadme,
    readFile,
    startBlank,
  }
}
