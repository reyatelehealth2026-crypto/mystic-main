# Tech Stack

## Framework & Runtime

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Node.js 20+

## Styling

- Tailwind CSS 4
- PostCSS
- Custom design tokens via CSS variables

## AI Integration

- Google Gemini API (gemini-2.0-flash model)
- Used for deep tarot interpretations and chat responses

## Development Tools

- ESLint with Next.js config
- TypeScript strict mode enabled

## Build System

Next.js handles all build, bundling, and optimization automatically.

## Common Commands

```bash
# Development
npm install          # Install dependencies
npm run dev         # Start dev server at http://localhost:3000

# Quality checks
npm run lint        # Run ESLint
npm run build       # Production build (must pass before deploy)

# Production
npm run start       # Start production server
```

## Environment Variables

Required in `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

## Path Aliases

- `@/*` maps to `src/*` for clean imports

## TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (automatic runtime)
- Module resolution: bundler
