---

name: modaco-review
description: Review and validate the ModaCo frontend case before submission. Use when checking architecture, TypeScript correctness, tests, MSW API compatibility, promotion business rules, or final repository readiness. Do not use for unrelated projects.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ModaCo Final Review Skill

Perform a focused review of the ModaCo Promotion Management frontend project.

## 1. Inspect the Repository

Read the following before making conclusions:

* `AGENTS.md`
* `package.json`
* `src/types/index.ts`
* `src/mocks/handlers.ts`
* `src/utils/queryKeys.ts`
* `src/utils/promotionUtils.ts`
* `src/utils/validationUtils.ts`
* Relevant API functions, hooks, pages, and components
* `AI_APPENDIX.md`

Treat the implementation and the MSW handlers as runtime sources of truth.

## 2. Check Architecture

Verify that:

* Redux stores only UI and filter state.
* TanStack Query owns all server state.
* API responses are not duplicated in Redux.
* All query hooks use the centralized query-key factory.
* Mutation hooks perform the required cache invalidations.
* Components do not contain duplicated business logic.
* Form state remains local to the promotion form.
* The product-target selector does not accidentally use the default `"shirt"` Redux filter.

## 3. Check Business Rules

Verify that:

* Promotion date ranges are inclusive.
* Promotions beginning or ending today are active.
* Effective prices use the shared utility.
* Fixed discounts cannot produce negative prices.
* Percentage discounts cannot exceed 100 during validation.
* End-date validation follows the case requirements.
* 409 conflicts block promotion creation and remain visible.
* 422 validation errors are mapped to inline form errors.
* Promotion statuses are derived from dates rather than stored.

## 4. Check API Compatibility

Inspect `src/mocks/handlers.ts` before evaluating response handling.

Verify that:

* Product queries use server-side search, filters, and pagination.
* API function response types match the actual MSW payloads.
* Conflict rendering matches the actual 409 response shape.
* Validation handling matches the actual 422 response shape.
* Preview requests are disabled until the required form values exist.

Do not assume that a prompt-level interface is correct when the runtime MSW response differs.

## 5. Run Verification

Read the available scripts from `package.json` before running commands.

Run the relevant configured scripts, including:

* Production or TypeScript build
* Unit tests
* Linting, if configured

Do not invent script names that are not present in `package.json`.

Do not hide failures or warnings.

## 6. Review the UI

When browser testing is available, verify:

* Product search, category filter, promotion-status filter, and pagination
* Product-detail navigation
* Promotion creation
* Category and product targeting
* Pre-seeded 409 conflict scenarios
* Inline validation
* Promotion deletion
* Live promotion preview
* Browser-console warnings

## 7. Review AI Documentation

Verify that `AI_APPENDIX.md`:

* Lists only tools that were actually used.
* Includes the actual important prompts rather than fabricated examples.
* Describes real AI errors that were identified and corrected.
* Does not claim that repository skills or instructions were used throughout development if they were added only after implementation.

## 8. Output Format

Return the review in this order:

1. Critical issues
2. Functional issues
3. Architecture issues
4. Type-safety issues
5. UI and accessibility issues
6. Test coverage gaps
7. AI_APPENDIX consistency
8. Final submission verdict

For every issue, include:

* File path
* Problem
* Why it matters
* Recommended correction

Do not modify files unless the user explicitly asks for fixes.
