// Copyright (c) 2026 David Linde. MIT License.
import { describe, it } from 'vitest'
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorPane } from './EditorPane'
import { buildTheme } from '../../theme'

const theme = buildTheme('light')

describe('EditorPane', () => {
  it('renders without crashing', () => {
    const editorViewRef = createRef<EditorView | null>() as React.MutableRefObject<EditorView | null>
    render(
      <EditorPane
        theme={theme}
        content="# Hello"
        editorViewRef={editorViewRef}
        wordCount={1}
        charCount={7}
        onChange={() => {}}
        showBorder={false}
      />
    )
  })
})
