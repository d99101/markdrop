# Markdrop

A minimal, browser-based Markdown editor. Drop a file, edit, preview — no accounts, no uploads, nothing leaves your device.

**[markdrop →](https://markdrop1.vercel.app)**

![Markdrop light](public/light-screenshot.png#gh-light-mode-only)
![Markdrop dark](public/dark-screenshot.png#gh-dark-mode-only)

## Features

- Drag & drop `.md` files to open
- Split editor / preview / both view modes
- Markdown toolbar + keyboard shortcuts (`Cmd+B`, `Cmd+I`, `Cmd+K`)
- Syntax highlighting in code blocks
- Light / dark / system theme
- Session persistence — content restored on refresh
- Installable PWA — works offline

## Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [CodeMirror 6](https://codemirror.net)
- [react-markdown](https://github.com/remarkjs/react-markdown)

## Development

```bash
npm install
npm run dev
```

## License

MIT © David Linde
