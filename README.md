# ModaCo Admin — Promotion Management Panel

A React-based internal admin panel for managing product promotions, built as a frontend case study.

## Features

- Product listing with search, category filter, and promotion status filter
- Server-side pagination (10 items per page)
- Product detail page with active promotion info and effective price
- Promotion management: create, delete, and preview promotions
- Conflict detection when promotions overlap
- Live promotion impact preview before submission

## Tech Stack

- React + TypeScript
- Redux Toolkit (filter/UI state)
- TanStack Query v5 (server state)
- Ant Design (component library)
- React Router v6
- SCSS
- Day.js
- Vitest (unit tests)
- MSW (mock API)

## Getting Started

```bash
npm install
npm run init:msw
npm run dev
```

## AI Workflow

AI-assisted development. See `AI_APPENDIX.md` for details.