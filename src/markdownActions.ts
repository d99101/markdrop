// Copyright (c) 2026 David Linde. MIT License.
import { EditorView } from '@codemirror/view'

export type Action =
  | { type: 'wrap'; before: string; after: string; placeholder: string }
  | { type: 'prefix'; prefix: string; placeholder: string }
  | { type: 'insert'; text: string }

export function applyAction(view: EditorView, action: Action) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)

  if (action.type === 'wrap') {
    const text = selected || action.placeholder
    const insert = action.before + text + action.after
    view.dispatch({
      changes: { from, to, insert },
      selection: {
        anchor: from + action.before.length,
        head: from + action.before.length + text.length,
      },
    })
  }

  if (action.type === 'prefix') {
    const text = selected || action.placeholder
    const lines = text
      .split('\n')
      .map((l) => action.prefix + l)
      .join('\n')
    view.dispatch({
      changes: { from, to, insert: lines },
      selection: { anchor: from, head: from + lines.length },
    })
  }

  if (action.type === 'insert') {
    view.dispatch({
      changes: { from, to, insert: action.text },
      selection: { anchor: from + action.text.length },
    })
  }

  view.focus()
}
