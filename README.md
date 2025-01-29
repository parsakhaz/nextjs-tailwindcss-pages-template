# Python Diff Generator

A web-based tool that generates beautiful, GitHub-style visual diffs for Python code. Built with Next.js and TypeScript.

## Features

- Side-by-side comparison of original and modified Python code
- GitHub-style syntax highlighting for Python
- Light and dark theme support
- Export options:
  - SVG format for vector graphics
  - High-quality PNG export
- Responsive design that works on both desktop and mobile
- Python-specific syntax highlighting and indentation handling

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the diff generator.

## How to Use

1. Paste your original Python code in the left textarea
2. Paste your modified Python code in the right textarea
3. (Optional) Change the filename from the default "example.py"
4. Click "Generate Diff" to see the visualization
5. Switch between light and dark themes using the theme buttons
6. Download the result as SVG or PNG using the download buttons

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- TypeScript for type safety
- TailwindCSS for styling
- html-to-image for PNG export
- Custom SVG generation for diffs

## Development

The main components of the project are:

- `pages/index.tsx` - Main diff generator page
- `lib/diff-generator.ts` - Core diff generation logic
- `components/ui/*` - Reusable UI components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your own projects!

---

Created by [Parsa Khazaeepoul](https://www.linkedin.com/in/parsas/)