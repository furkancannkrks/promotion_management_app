# AI_APPENDIX.md

## 1. AI Tools Used

* **Codex (GPT-5.5)** — Used as the primary implementation tool. I entered the prepared milestone prompts sequentially and used Codex to generate and modify the project code step by step.
* **Claude Sonnet 4.6** — Used to review generated outputs, identify implementation problems, refine prompts, and evaluate architectural decisions.
* **ChatGPT Free** — Used during the prompt-planning and review phase. The specific model name was not displayed in the interface.
* **Cross-validation workflow** — During prompt preparation, I compared suggestions from Claude Sonnet 4.6 and ChatGPT instead of relying on a single AI output. During implementation, I also verified generated code through TypeScript builds, unit tests, browser behavior, console warnings, and inspection of the provided MSW mock API.

---

## 2. Two Most Important Prompts

### Prompt 1 — Redux Scope and Server-State Separation (Step 7)

> Treat the existing codebase as the source of truth. Only modify files necessary for this milestone. Set up Redux Toolkit store in `src/app/store.ts`.
>
> Create a `filtersSlice` in `src/features/filters/filtersSlice.ts` with this state shape:
>
> ```ts
> {
>   search: "shirt",
>   category: "",
>   promotionStatus: "all" as "all" | "on_promotion" | "no_promotion",
>   page: 1
> }
> ```
>
> Note: initial search value is `"shirt"` — this is a business requirement. When the app loads with no prior state, it must behave as if `"shirt"` is already searched.
>
> Actions:
>
> * `setSearch(value: string)` → updates search, resets page to 1
> * `setCategory(value: string)` → updates category, resets page to 1
> * `setPromotionStatus(value: string)` → updates promotionStatus, resets page to 1
> * `setPage(value: number)` → updates page only
>
> Export typed hooks from `src/app/hooks.ts`:
>
> * `useAppDispatch`
> * `useAppSelector`
>
> Architectural constraint — Redux scope: Redux is only for UI and filter state. It must NEVER store server responses such as product lists or promotion lists.
>
> The case document says "Manage promotions via Redux Toolkit" — this means filter and UI state only. The actual promotion and product data lives in the React Query cache. Redux is never the primary data store for server responses.
>
> Explain the architectural decision: why Redux is used for filters and React Query for server state, and what problems would arise if server state were also stored in Redux.

**Why this was important:**

The case contained potentially ambiguous wording around Redux Toolkit while also requiring TanStack Query for API fetching and caching. I resolved this ambiguity by giving the two tools separate responsibilities.

Redux owns client-side UI state such as the search value, selected category, promotion-status filter, and current page. TanStack Query owns server state such as products, promotions, loading states, API errors, caching, refetching, and cache invalidation.

Storing the same API responses in both Redux and the React Query cache would have created two sources of truth. This could have caused stale data, duplicated loading and error logic, additional synchronization code, and incorrect UI updates after creating or deleting a promotion.

---

### Prompt 2 — Utility Function Extraction and Testing (Step 6)

> Treat the existing codebase as the source of truth. Only modify files necessary for this milestone. Create pure utility functions in `src/utils/promotionUtils.ts`. Use dayjs for all date operations.
>
> 1. `getPromotionStatus(promotion: Promotion): PromotionStatus`
>
> * Use dayjs to compare today's date with `startDate` and `endDate`, inclusively.
>
> * Return `"active"` if today is within the range: `startDate <= today <= endDate`.
>
> * Return `"scheduled"` if `startDate` is in the future.
>
> * Return `"expired"` if `endDate` is in the past.
>
> 2. `calculateEffectivePrice(basePrice: number, promotion?: Promotion): number`
>
> * If there is no promotion or the promotion is not active, return `basePrice`.
>
> * If `discountType` is `"percentage_off"`, return `basePrice * (1 - value / 100)`.
>
> * If `discountType` is `"fixed_amount_off"`, return `Math.max(0, basePrice - value)`.
>
> * Always round the result to two decimal places.
>
> 3. `isPromotionActive(promotion: Promotion): boolean`
>
> * Return true only if `getPromotionStatus` returns `"active"`.
>
> 4. `parseConflictResponse(error: unknown): ConflictItem[]`
>
> * If the error is a 409 Axios response, extract and return the conflicts array.
> * If the error is a 422 Axios response, return an empty array.
> * Otherwise return an empty array.
>
> Then create `src/utils/promotionUtils.test.ts` using Vitest.
>
> Tests for `getPromotionStatus`:
>
> * Promotion starting today → `"active"`
> * Promotion ending today → `"active"`
> * Promotion entirely in the past → `"expired"`
> * Promotion entirely in the future → `"scheduled"`
>
> Tests for `calculateEffectivePrice`:
>
> * No promotion → returns `basePrice`
> * `percentage_off` 20% on 100 → returns 80
> * `fixed_amount_off` 200 on 150 → returns 0
> * `percentage_off` 100 → returns 0
>
> Tests for `parseConflictResponse`:
>
> * 409 response with conflicts array → returns conflicts
> * Non-Axios error → returns an empty array
>
> Explain why these are pure functions and why that makes them easier to test.

**Why this was important:**

Promotion status calculation and effective-price calculation are core business rules used in multiple parts of the application. Extracting this logic into reusable utility functions prevented the Products page, Product Detail page, and Promotion form from implementing different versions of the same rule.

The date-boundary tests were especially important because the case defines promotion validity as inclusive. A promotion that starts today or ends today must still be considered active.

Because these functions do not depend on React components, Redux state, or browser rendering, they can be tested directly with simple inputs and expected outputs. Keeping the business rules in one place also makes future changes safer and reduces duplication.

---

## 3. Two AI Errors I Caught and Corrected

### Error 1 — Build Failure After Type Contract Replacement

**What the AI generated:**

The AI replaced the previous definitions in `src/types/index.ts` with the domain and API types required by the milestone. However, other files in the existing codebase still imported removed type names such as:

* `ProductListItem`
* `ProductListParams`
* `CreatePromotionPayload`
* `PromotionListItem`

**Why it was wrong:**

Although the new type definitions matched the requested contract, the change left the repository in a non-compiling state. Existing API files and hooks still depended on the old exports.

The AI handled the type-definition milestone as an isolated file change without fully accounting for the downstream consumers of those types.

**How I identified the mistake:**

I ran the project build after the milestone:

```bash
npm run build
```

TypeScript reported missing-export errors in the API and hook files that still referenced the removed type names.

The generated step summary also mentioned that the build was currently failing because other files still imported the older helper types. This indicated that the generated result was incomplete and should not be accepted as finished.

**What I changed:**

I prompted the AI to search the codebase for every import of the removed type names and migrate those consumers to the new type contracts.

I did not restore the outdated types or create unnecessary compatibility aliases. Instead, I updated the affected API functions and hooks to use the current domain and response types.

After the changes, I ran the build again and confirmed that it completed successfully.

---

### Error 2 — Incorrect Conflict Response Assumption and Deprecated Ant Design Properties

**What the AI generated:**

The generated conflict-handling code assumed that the 409 response contained an array of `ConflictItem` objects.

It attempted to read properties such as:

```tsx
item.productId
item.conflictingPromotionId
item.productName
item.conflictingPromotionName
```

It also created React keys with:

```tsx
key={`${item.productId}-${item.conflictingPromotionId}`}
```

Additionally, the generated Ant Design `Alert` and notification calls used the `message` property.

**Why it was wrong:**

I inspected `src/mocks/handlers.ts` and found that the actual MSW 409 response returned `conflicts` as a `string[]`, not as an array of `ConflictItem` objects.

Each conflict item was therefore a plain string. Trying to access `item.productId` or `item.conflictingPromotionId` returned `undefined`.

As a result, the conflict content was not rendered correctly and multiple items received the same React key:

```text
undefined-undefined
```

The installed Ant Design version also marked the `message` property as deprecated for the relevant `Alert` and notification APIs and recommended using `title` instead.

**How I identified the mistake:**

I tested one of the pre-seeded promotion-conflict scenarios. The browser console displayed the following React warning:

```text
Encountered two children with the same key, undefined-undefined
```

It also displayed the Ant Design warning:

```text
[antd: Alert] message is deprecated. Please use title instead.
```

I then inspected the implementation in `src/mocks/handlers.ts` and compared the actual MSW response with the generated TypeScript assumptions and rendering logic.

This confirmed that the AI had relied on the expected prompt-level response structure without verifying the actual runtime response produced by the provided mock API.

**What I changed:**

I updated the conflict-handling and rendering logic to treat the `conflicts` response as a string array.

Instead of attempting to access object properties, the component now maps over and displays each conflict string directly. Because the conflict list is static and is not reordered or edited, I used the array index as the React key.

I also updated the relevant conflict-response typing and parsing path so that the TypeScript implementation matched the actual MSW response.

Finally, I replaced the deprecated `message` properties with `title` in the relevant Ant Design `Alert` and notification calls.

After these changes, I repeated the 409 conflict scenario and confirmed that:

* The conflict details were displayed correctly.
* The `undefined-undefined` React key warning was removed.
* The Ant Design deprecation warnings no longer appeared.