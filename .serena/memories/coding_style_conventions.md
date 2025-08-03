# Coding Style and Conventions

## TypeScript Configuration
- Strict TypeScript enabled
- Path aliases: `@/*` maps to `./src/*`
- JSX preservation for Next.js
- Incremental compilation enabled

## ESLint Configuration
- Extends Next.js core web vitals
- Custom rules:
  - `@next/next/no-img-element: off` (allows regular img tags)
  - `react/no-unescaped-entities: off` (allows quotes in JSX)

## Code Style Guidelines
- **Language**: Mixture of Japanese and English
  - UI text and comments often in Japanese
  - Variable names in English
  - Function names in English

- **Naming Conventions**:
  - Components: PascalCase (e.g., `StylistCard`)
  - Files: kebab-case for pages, PascalCase for components
  - Variables: camelCase
  - Types/Interfaces: PascalCase

- **Component Structure**:
  - Functional components with hooks
  - TypeScript interfaces for props
  - Consistent export patterns

## Tailwind CSS Usage
- Custom color palette: `primary`, `ocean-blue`
- Extended animations and keyframes
- Mobile-first responsive design
- Consistent spacing and typography

## File Organization
- Pages use Next.js App Router structure
- Components are modular and reusable
- Data types centralized in `types/index.ts`
- Utilities separated by concern (Firebase, S3, etc.)