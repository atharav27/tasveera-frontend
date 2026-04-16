---
name: api-hooks
description: Create Alova-based API hooks for admin-frontend. Use when adding or generating hooks that call backend APIs.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Hooks Agent

> Use this agent when creating or generating hooks that call backend APIs in `apps/admin-frontend/hooks`. All API hooks use **Alova** with `alovaInstance` from `@/lib/api` (auth token is injected automatically).

---

## 1. Reference Implementation

**Canonical examples** (read these when implementing):

- **List + filters + pagination:** [hooks/use-tickets.ts](apps/admin-frontend/hooks/use-tickets.ts) — `useTickets`, ticket stats, support metrics
- **Single resource by ID:** [hooks/use-tickets.ts](apps/admin-frontend/hooks/use-tickets.ts) — `useTicketDetails`; [hooks/use-bookings.ts](apps/admin-frontend/hooks/use-bookings.ts) — `useBookingDetails` (for ticket raise flow)
- **Stats / dashboard:** [hooks/use-dashboard.ts](apps/admin-frontend/hooks/use-dashboard.ts) — `useDashboardStats`, analytics widgets, SOS alerts
- **Mutations (POST/PATCH/PUT):** [hooks/use-corporate-roles.ts](apps/admin-frontend/hooks/use-corporate-roles.ts) — e.g. `useChangePassword`, user directory APIs; [hooks/use-tickets.ts](apps/admin-frontend/hooks/use-tickets.ts) — `useCreateTicket`, `useUpdateTicket`

**API layer:** [lib/api.ts](apps/admin-frontend/lib/api.ts) — single `alovaInstance`, `beforeRequest` injects auth from `authClient.getSession()`, `responded.onSuccess` parses JSON and throws on 4xx/5xx.

---

## 2. Alova Primitives

| Need | Use | Options |
|------|-----|--------|
| Fetch when deps change (list, stats, detail) | `useWatcher` | `initialData`, `immediate: !!requiredId` or `true`, watch deps array |
| One-off or user-triggered (create, update, search) | `useRequest` | `immediate: false`, pass `send` as the mutation/search function |

**Imports:**

```ts
import { useWatcher, useRequest } from 'alova/client';
import { alovaInstance } from '@/lib/api';
```

---

## 3. Response and Params Conventions

- **Response wrapper:** API responses use `{ success: boolean; data: T; meta?: M }`. Type as `XxxResponse` and use `data.data` / `data.meta` in the hook return.
- **Query params:** Build a `Record<string, string | number | boolean | undefined>`; only add keys when value is defined (e.g. `if (params?.page) queryParams.page = params.page`). Pass to `alovaInstance.Get(url, { params: queryParams })`.
- **Dates:** If the API expects date-only strings, use a small helper (e.g. `formatDateForQuery` in [hooks/use-tickets.ts](apps/admin-frontend/hooks/use-tickets.ts)) to strip time from ISO strings (YYYY-MM-DD). See §3.1.
- **Stability:** For object/array params, use `JSON.stringify(params)` in the useWatcher dependency array so changes are detected without reference churn.

### 3.1. Date query params (YYYY-MM-DD)

Many APIs expect **date** format (YYYY-MM-DD) for query params like `dateFrom`, `dateTo`, `fromDate`, `toDate`. Sending full ISO strings (e.g. `2026-01-31T18:30:00.000Z`) causes backend validation errors (e.g. `querystring/dateFrom must match format "date"`).

**Cause:** Callers often pass dates from `useDateFilterStore().getDateRange()`, which returns `fromDate` and `toDate` as `toISOString()` (full ISO). Hooks must convert these to YYYY-MM-DD before adding to the request.

**Rule:** In the hook, before adding any date param to `queryParams`, pass it through a `formatDateForQuery`-style helper so the request always sends YYYY-MM-DD.

**formatDateForQuery helper:**

- Takes an optional date string.
- If it contains `'T'`, return the date part only (e.g. `2026-01-31T18:30:00.000Z` → `2026-01-31`).
- Otherwise return the string as-is (already YYYY-MM-DD).
- Return `undefined` for empty input.

**Example:** [hooks/use-dashboard.ts](apps/admin-frontend/hooks/use-dashboard.ts) — `useAnalyticsDashboard` uses `formatDateForQuery(params?.dateFrom)` and `formatDateForQuery(params?.dateTo)` before setting `queryParams.dateFrom` and `queryParams.dateTo`. Callers (e.g. top-vendor-performance, monthly-spend-trend) keep passing `dateRange.fromDate` and `dateRange.toDate` from the store; the hook converts them so the API receives YYYY-MM-DD.

**Checklist:** When adding or changing a hook that accepts date query params, check the API spec for format. If it expects "date" (YYYY-MM-DD), use `formatDateForQuery` (or equivalent) inside the hook so callers can pass ISO strings from the date filter store without validation errors.

---

## 4. GET Hooks (useWatcher)

### List with pagination/filters

- **Method:** `alovaInstance.Get<XxxListResponse>(url, { params: queryParams })`.
- **Watch deps:** `[scopeId, JSON.stringify(params)]` (scopeId = e.g. `corporateId`).
- **initialData:** `{ success: true, data: [], meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 } }`.
- **immediate:** `!!scopeId` (or `true` if no required scope).
- **Return:** `{ items: data.data, meta: data.meta, isLoading: loading, error, refresh }`.

### Single resource by ID

- **Method:** `alovaInstance.Get<XxxDetailResponse>(url)` with `url` containing the id.
- **Watch deps:** `[id]` (and optional `includeComments` etc.).
- **immediate:** `!!id`.
- **initialData:** `{ success: true, data: {} as Entity }` (or minimal default).
- **Return:** `{ entity: data.data, isLoading: loading, error, refresh }`.

### Stats / dashboard

- **Method:** `alovaInstance.Get<XxxStatsResponse>(url, { params })`.
- **Watch deps:** `[scopeId, params?.fromDate, params?.toDate]` or `JSON.stringify(params)`.
- **initialData:** Define a `defaultStats` constant matching the shape; set `initialData: { success: true, data: defaultStats }`.
- **Return:** `{ stats: data.data, meta: data.meta (if any), isLoading: loading, error, refresh }`.

---

## 5. Mutation Hooks (useRequest)

- **Method:** `alovaInstance.Post/Patch/Put/Delete(url, payload)`.
- **Config:** `{ immediate: false }`.
- **Signature:** `(payload) => ...` or `(id, payload) => ...` depending on API.
- **Return:** `{ mutationFn, isMutating: loading, error, result: data?.data }`. Name `mutationFn` by action (e.g. `createTicket`, `updateStatus`, `inviteUser`).

---

## 6. File Structure

1. **Imports** — `useWatcher` / `useRequest`, `alovaInstance`, and any types from `@/types/...` if shared.
2. **Interfaces & types** — Response wrappers (`XxxResponse`), params (`XxxParams`), and entity types. Export types that consumers need.
3. **Constants** — Default objects for `initialData` (e.g. `defaultStats`, `defaultMetrics`).
4. **Helpers** (optional) — e.g. `formatDateForQuery` for date params.
5. **Hooks** — Each hook must have a JSDoc that states the purpose of the API and when it runs (see §6.1). Do not leave hooks without an API-purpose comment. “”).

---

## 6.1. API Purpose Comments (Required)

**Every hook that wraps an API must document the purpose of that API.** This helps consumers and future maintainers know what the endpoint does and when to use it.

**For each hook, add a JSDoc block that includes:**

1. **Purpose of the API** — What the endpoint does in one short sentence (e.g. fetches billing summary for a corporate, creates a support ticket and optionally links to a booking or invoice).
2. **When it runs** — For `useWatcher`: when the request is sent (e.g. when corporateId or params change, when ticketId is set). For `useRequest`: call the returned function to run (e.g. createTicket(payload)).
3. **Optional:** The API path if it helps (e.g. GET /api/v1/corporates/:corporateId/invoices/summary).

**Example — list hook:**

```ts
/**
 * Fetches paginated billing periods/invoices for a corporate.
 * Purpose: List invoices with optional filters (status, month) and pagination.
 * Runs when corporateId or params change.
 */
export const useBillingPeriods = (corporateId: string, params?: BillingPeriodParams) => {
```

**Example — mutation hook:**

```ts
/**
 * Creates a new support ticket (raise a ticket).
 * Purpose: Submit a ticket with category, subject, description; optionally link to booking or invoice.
 * Call createTicket(payload) to run.
 */
export const useCreateTicket = () => {
```

**Example — single-resource hook:**

```ts
/**
 * Fetches full details of a specific invoice including line items.
 * Purpose: Load invoice for detail view or edit.
 * Runs when corporateId and invoiceId are set.
 */
export const useInvoiceDetails = (corporateId: string, invoiceId: string) => {
```

**Rule:** When creating or generating a new hook, always add this JSDoc so the **purpose of the API** is clear; do not leave hooks without an API-purpose comment.

---

## 7. Naming and Return Shape

| Hook type | Naming | Return loading | Return data |
|-----------|--------|----------------|-------------|
| List | `useXxxList` or `useXxxs` | `isLoading` | `items`/`xxxList`, `meta` |
| Single | `useXxxDetails` or `useXxx` | `isLoading` | `entity`/`xxx` |
| Stats | `useXxxStats` | `isLoading` | `stats`, optional `meta` |
| Create | `useCreateXxx` | `isCreating` | `createdXxx` (from `data?.data`) |
| Update | `useUpdateXxx` | `isUpdating` | `updatedXxx` |
| Action | `useXxxAction` (e.g. close, assign) | `isXxxing` | `result` |

Always expose `error` and `refresh` (for useWatcher) or the mutation function (for useRequest).

---

## 8. Scope and Conditional Fetch

- **Corporate-scoped:** First argument is `corporateId: string`. Use `immediate: !!corporateId` and in the request URL use `/api/v1/corporates/${corporateId}/...`.
- **Optional scope:** If the hook can run without an id (e.g. global stats), use `immediate: true` and default `initialData` so UI never sees undefined.
- **Lazy fetch:** For search or “load on demand”, use `useRequest` with `immediate: false` and return the `send` function (e.g. `search(term)`, `fetchVendors(bookingId)`).

---

## 9. What Not to Do

- **No mock data in API hooks.** New hooks must use Alova and real endpoints; user/role APIs live in [hooks/use-corporate-roles.ts](apps/admin-frontend/hooks/use-corporate-roles.ts).
- **No raw fetch/axios.** All API calls go through `alovaInstance` so auth and error handling stay consistent.
- **No duplicate types.** If a type exists in `@corpora/utils` or `@/types/...`, import it; define only hook-specific or API-specific types (e.g. response wrappers, params) in the hook file.

---

## 10. Checklist for a New API Hook

- [ ] Import `useWatcher` or `useRequest` and `alovaInstance` from `@/lib/api`.
- [ ] Define and export `XxxResponse` / `XxxParams` / entity types as needed.
- [ ] Use `initialData` with the same shape as the API response to avoid undefined in UI.
- [ ] UseWatcher: set `immediate` and dependency array; useRequest: set `immediate: false`.
- [ ] Return a stable shape: data slice (e.g. `data.data`), `isLoading`/`isXxxing`, `error`, and `refresh` or mutation function.
- [ ] Add JSDoc with **purpose of the API** (what the endpoint does), when it runs, and optionally the path (see §6.1).
- [ ] If the endpoint is corporate-scoped, accept `corporateId` and use it in URL and `immediate: !!corporateId`.
- [ ] If the API expects date query params in "date" format (YYYY-MM-DD), pass them through `formatDateForQuery` (or equivalent) in the hook so callers can pass ISO strings from the date filter store (see §3.1).
