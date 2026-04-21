// Copyright (c) 2026 David Linde. MIT License.
export const MARKDROP_README = `# Markdrop

A minimal, browser-based markdown editor. Drop a file, edit, preview — no accounts, no uploads.

---

## Getting started

- **Open a file** — drag any \`.md\` file onto the window to load it
- **Edit** — the left pane is a full editor with syntax highlighting
- **Preview** — the right pane renders your markdown in real time
- Click **Markdrop** in the toolbar at any time to return to this document

---

## Toolbar

| Button | Action |
| ------ | ------ |
| H1 H2 H3 | Prefix selected line(s) with a heading |
| **B** | Wrap selection in \`**bold**\` |
| _I_ | Wrap selection in \`_italic_\` |
| ~~S~~ | Wrap selection in \`~~strikethrough~~\` |
| \` \` | Wrap selection in backticks (inline code) |
| \`</>\` | Wrap selection in a fenced code block |
| Link | Wrap selection as \`[text](url)\` |
| Image | Wrap selection as \`![alt](url)\` |
| > | Prefix lines with \`> \` (blockquote) |
| • | Prefix lines with \`- \` (bullet list) |
| 1. | Prefix lines with \`1. \` (ordered list) |
| ☐ | Prefix lines with \`- [ ] \` (task list) |
| — | Insert a horizontal rule |
| ⊞ | Insert a table template |

> **Tip:** Select text first, then click a button to wrap or prefix it.
> Without a selection, a placeholder is inserted.

---

## View modes

Use the **Editor / Both / Preview** control in the top-right to switch layouts.

---

## Theme

Click the sun/moon icon in the toolbar to cycle between **Light**, **Dark**, and **System** (follows your OS setting). Your preference is saved across sessions.

---

## Keyboard shortcuts

CodeMirror provides standard editor shortcuts out of the box:

| Shortcut | Action |
| -------- | ------ |
| \`Ctrl/Cmd Z\` | Undo |
| \`Ctrl/Cmd Shift Z\` | Redo |
| \`Ctrl/Cmd /\` | Toggle line comment |
| \`Tab\` | Indent |

---

## Session persistence

Your edits are saved to \`sessionStorage\` automatically. Refreshing the page restores your last content. Dropping a new file replaces it.

---

*Built with React, Vite, CodeMirror, and react-markdown.*
`
