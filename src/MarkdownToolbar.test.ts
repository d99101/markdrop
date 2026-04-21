import { describe, it, expect } from 'vitest'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { applyAction } from './MarkdownToolbar'

function makeView(doc: string, anchor: number, head = anchor) {
  const state = EditorState.create({ doc, selection: { anchor, head } })
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  return new EditorView({ state, parent })
}

describe('applyAction — wrap', () => {
  it('wraps selected text in bold markers', () => {
    const view = makeView('hello world', 6, 11)
    applyAction(view, { type: 'wrap', before: '**', after: '**', placeholder: 'bold' })
    expect(view.state.doc.toString()).toBe('hello **world**')
  })

  it('inserts placeholder when no selection', () => {
    const view = makeView('', 0)
    applyAction(view, { type: 'wrap', before: '_', after: '_', placeholder: 'italic' })
    expect(view.state.doc.toString()).toBe('_italic_')
  })

  it('wraps as link', () => {
    const view = makeView('click here', 6, 10)
    applyAction(view, { type: 'wrap', before: '[', after: '](url)', placeholder: 'link text' })
    expect(view.state.doc.toString()).toBe('click [here](url)')
  })
})

describe('applyAction — prefix', () => {
  it('prefixes line with heading marker', () => {
    const view = makeView('Hello', 0, 5)
    applyAction(view, { type: 'prefix', prefix: '# ', placeholder: 'Heading' })
    expect(view.state.doc.toString()).toBe('# Hello')
  })

  it('inserts placeholder when no selection', () => {
    const view = makeView('', 0)
    applyAction(view, { type: 'prefix', prefix: '- ', placeholder: 'item' })
    expect(view.state.doc.toString()).toBe('- item')
  })
})

describe('applyAction — insert', () => {
  it('inserts text at cursor', () => {
    const view = makeView('', 0)
    applyAction(view, { type: 'insert', text: '\n---\n' })
    expect(view.state.doc.toString()).toBe('\n---\n')
  })
})
