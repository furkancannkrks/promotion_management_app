# ModaCo Repository Instructions

## Project Overview

This repository contains the ModaCo Promotion Management frontend case study.

The application uses:

* React
* TypeScript
* Redux Toolkit
* TanStack Query v5
* Axios
* Ant Design
* React Router
* SCSS
* Day.js
* Vitest
* MSW

## Architecture Rules

* Treat the existing codebase and the MSW handlers as the source of truth.
* Use TypeScript strict mode.
* Never introduce `any`.
* Prefer functional React components.
* Keep files focused and reasonably small.
* Extract reusable component logic into custom hooks.
* Extract reusable business logic into pure utility functions.
* Use Day.js for all date comparisons and date formatting.

## State Management

* Redux Toolkit is only for client-side UI and filter state.
* Never store API responses in Redux.
* TanStack Query is the source of truth for products, promotions, categories, loading states, API errors, and cache invalidation.
* Never duplicate server state between Redux and TanStack Query.
* Use the centralized query keys from `src/utils/queryKeys.ts`.
* Never hardcode query-key strings in hooks or components.

## API Rules

* Use the Axios instance defined in `src/api/axios.ts`.
* All API requests must use the `/api` prefix.
* Before assuming an API response shape, inspect the relevant MSW handler in `src/mocks/handlers.ts`.
* Do not invent response fields that are not present in the project types or MSW handlers.
* Handle 409 conflict responses separately from 422 validation responses.

## UI Rules

* Use Ant Design components where appropriate.
* Use the reusable `StatusTag` component for promotion and product statuses.
* Do not hardcode status colors in pages or other components.
* Keep forms local unless their state must be shared across multiple routes.
* Do not put temporary form input state in Redux.
* Preserve basic accessibility and keyboard navigation.

## Business Rules

* Promotion date ranges are inclusive.
* A promotion starting today is active.
* A promotion ending today is active.
* Promotion status must be derived from dates rather than stored.
* Effective-price calculations must use `calculateEffectivePrice`.
* Effective prices must never be negative.
* A product can have at most one active promotion for an overlapping date range.

## Change Discipline

* Only modify files necessary for the requested task.
* Do not perform unrelated refactors.
* Do not add dependencies unless they are necessary.
* Do not overwrite existing working behavior without explaining the reason.
* Preserve existing architectural boundaries.

## Verification

Before declaring a task complete:

1. Review the changed files.
2. Run the TypeScript build.
3. Run the unit tests.
4. Check for browser-console warnings when UI behavior changes.
5. Verify the relevant MSW response shape when API behavior changes.
6. Report any remaining warnings or failures honestly.
