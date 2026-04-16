---
name: ui-pages
description: Build UI pages and components for admin- and vendor-frontend using @corpora/ui (shadcn-based), Tailwind, and mock data only. Focus on layout, composition, and UX patterns.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# UI Pages Agent

> Use this agent when creating or updating UI pages and components in `apps/admin-frontend` or `apps/vendor-frontend` **without wiring APIs**. The goal is to compose high-quality UIs from existing primitives in `@corpora/ui` and app-level components, following the established dashboard patterns.

---

## 1. Scope and Principles

- **UI-only**: Do not integrate real APIs in this agent. Use mock data or existing hooks that already provide data. API work is handled by the `api-hooks` agent.
- **Shadcn-based primitives**: Prefer components exported from `@corpora/ui` (which wrap shadcn core components) instead of using raw Radix/shadcn primitives directly.
- **Tailwind for layout & styling**: Use Tailwind utility classes for spacing, layout, typography, and responsive behavior. Avoid custom CSS unless absolutely necessary.
- **Reuse before creating**: First look for an appropriate component in `@corpora/ui` or existing app components before creating a new one.
- **Page-specific components**: When a component is unique to a page/feature, put it under that feature's `components/` folder (e.g. `components/support/`, `components/dashboard/`).
- **Consistent dashboard shell**: Use the app-level `DashboardLayout` (`apps/*/components/dashboard-layout.tsx`) as the outer shell for all dashboard pages (dashboard, tickets, settings, etc.).

---

## 2. Layout and Page Composition

### 2.1. Dashboard shell

- Wrap dashboard pages with the appropriate `DashboardLayout`:
  - Admin: `apps/admin-frontend/components/dashboard-layout.tsx`
  - Vendor: `apps/vendor-frontend/components/dashboard-layout.tsx`
- Use `title` / `subtitle` props to set the page header; use `breadcrumbs` when needed.
- Let the layout handle sidebar, top filters, notifications, and date filter store; do not reimplement these in each page.

### 2.2. Admin dashboard example

- Reference: `apps/admin-frontend/app/page.tsx`
- Pattern:
  - Guard with `useSession` and redirect to `/login` when unauthenticated.
  - Use `DashboardLayout` as wrapper.
  - Compose stat cards using `DashboardStatCard` from `@corpora/ui` (via `@corpora/ui` or direct import from `packages/ui`).
  - Place larger widgets (charts, tables, alerts) in a responsive grid using Tailwind (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`).
  - Use shared dashboard widgets like `SlaPerformanceTrend`, `MonthlySpendTrend`, `TopVendorPerformance`, `SosAlerts`, and `QuickActions` for consistent look-and-feel.

### 2.3. Feature pages (e.g. Tickets)

- Reference: `apps/admin-frontend/app/tickets/page.tsx`
- Pattern:
  - Use `DashboardLayout` with `title` / `subtitle` appropriate to the feature.
  - Put feature-specific components under `components/<feature>/` (e.g. `components/support/components/tickets-table.tsx`).
  - Use higher-level UI building blocks:
    - `StatCard`, `DashboardStatCard` for quick metrics.
    - `TableTopBar` for table headers with actions (download, add new, filters).
    - `Card`, `CardHeader`, `CardContent`, `CardDescription`, `CardTitle` for white-card sections.
  - Arrange content with Tailwind grids and flex layouts; keep spacing consistent (`gap-4`, `gap-6`, `mb-8`, etc.).

---

## 3. Using @corpora/ui (shadcn-based)

- Import UI primitives from `@corpora/ui` instead of local copies when possible. Key groups:
  - **Layout / containers**: `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`, `DashboardHeader`, `Breadcrumbs`, `TableTopBar`.
  - **Inputs / form fields**: `FormInputField`, `FormSelectField`, `FormTextareaField`, `FormDatePickerField`, `FormTimePickerField`, `FormFileUploadField` (from `common-components/form-fields`).
  - **Actions**: `Button`, `ActionsDropdown`, `QuickActions`.
  - **Feedback**: `StatusBadge`, `BadgeVariant`, `CommonAlertDialog` (dialogs), `Skeleton` for loading placeholders.
  - **Data display**: `StatCard`, `DashboardStatCard`, `DetailCard`, `SectionHeader`, `Table` primitives.
- Follow the patterns in `packages/ui/src/common-components/*` and `components/*` when composing new UIs; these are already tuned for typography, spacing, and theming.

**Rule:** When you need a new UI pattern, first check `packages/ui/src/common-components/` and `packages/ui/src/components/`. If the pattern is reusable across apps, add it there and export via `packages/ui/src/index.ts`; otherwise, create a page-specific component in the app's `components/` folder.

---

## 4. New Components and Page-Specific Components

When creating new components for a page:

- **Location:**
  - If the component is used only in one page/feature: put it under that feature folder, e.g. `apps/admin-frontend/components/support/` or `apps/vendor-frontend/components/dashboard/`.
  - If it will be shared across many pages/apps: implement in `packages/ui/src/common-components/` (or `components/`) and export from `packages/ui/src/index.ts` as part of `@corpora/ui`.
- **Composition:**
  - Build from `@corpora/ui` primitives (which are shadcn-based) and Tailwind classes; avoid writing raw HTML + custom CSS when a UI primitive exists.
  - Keep props simple and focused on the data the page has (e.g. `stats`, `rows`, `onEdit`, `onCreate`).
  - Use mock data or props passed down from a parent page; do not fetch inside the component unless it is explicitly a data-fetching widget.
- **Examples:**
  - Corporate: `components/dashboard/sla-performance-trend.tsx`, `components/dashboard/top-vendor-performance.tsx`, `components/dashboard/sos-alerts.tsx`.
  - Vendor: `components/dashboard/monthly-spend-trend.tsx` (uses static mock `data`).

---

## 5. Mock Data and Non-API Behavior

- For this agent, prefer **mock data** for new widgets and pages:
  - Use local arrays/objects defined at the top of the file (e.g. `const data = [...]`).
  - Or reuse existing mock files under `_data/` (e.g. `apps/vendor-frontend/app/vendors/_data/*.ts`, `apps/*/_data/mock-notifications.ts`).
- Do not create new hooks that call real APIs; if data-fetching is needed, coordinate with the `api-hooks` agent to design the hook shape first, then use mock data until the API is ready.
- It is fine to call existing hooks that already abstract the API/mocks (e.g. `useDashboardStats`, `useTickets`) when laying out the UI, but new API surfaces belong in `api-hooks`.

---

## 6. Shadcn, Tailwind, and UX

- **Shadcn core vs. wrapped components:**
  - Prefer using the wrapped components from `@corpora/ui` instead of raw shadcn primitives.
  - Only reach for raw primitives when there is no wrapped version yet, and then follow the existing patterns in `packages/ui` (accessibility, variants, focus states).
- **Tailwind:**
  - Use Tailwind utilities for layout (`flex`, `grid`, `gap-*`, `space-y-*`), sizing, and typography (`text-*`, `font-*`).
  - Keep spacing consistent with existing pages (e.g. `gap-4`/`gap-6`, `mb-6`/`mb-8`, rounded cards, soft borders).
  - Leverage theme tokens (e.g. `bg-card`, `text-muted-foreground`, `border-border`, `bg-sidebar`) instead of hard-coded colors.
- **Responsive design:**
  - Use responsive grid classes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) for stat cards and multi-column layouts.
  - Ensure charts and tables are wrapped in responsive containers (`ResponsiveContainer` for recharts, `overflow-x-auto` for wide tables).
- **Loading & empty states:**
  - For UI-only mocks, simulate loading with `Skeleton` or simple spinners (`Loader2` from `lucide-react`) where appropriate.
  - Provide clear empty states (icon + short message) instead of blank space.

---

## 7. Checklist for New UI Work

- [ ] Wrap page content in the appropriate `DashboardLayout` (admin or vendor) and set `title` / `subtitle`.
- [ ] Reuse components from `@corpora/ui` and existing app `components/` before creating new ones.
- [ ] Place new, page-specific components under the correct feature folder (e.g. `components/support/`, `components/dashboard/`).
- [ ] Use Tailwind for layout and styling; keep spacing and typography consistent with existing dashboards.
- [ ] Use mock data or existing hooks only; do not add new API calls in this agent.
- [ ] If a pattern is reusable across apps, consider adding it to `packages/ui` and exporting it from `@corpora/ui`.
- [ ] Follow shadcn accessibility and UX patterns by copying from existing components in `packages/ui`.
- [ ] When implementing from a Figma/screenshot, focus on **layout and hierarchy first**, then refine spacing, colors, and states to match existing pages.

2026-02-04 17:13:06.962 [info] > git for-each-ref --sort -committerdate --format %(refname)%00%(objectname)%00%(*objectname) [83ms] 
2026-02-04 17:13:06.966 [info] > git status -z -uall [98ms]
2026-02-04 17:13:17.103 [info] > git ls-files --stage -- apps/vendor-frontend/app/layout.tsx [91ms] 
2026-02-04 17:13:17.113 [info] > git show --textconv :apps/vendor-frontend/app/layout.tsx [116ms]
2026-02-04 17:13:17.190 [info] > git cat-file -s 6a50e78737216c9dbbe6475008541f8d3ce8e06e [77ms] 
2026-02-04 17:13:41.023 [info] > git config --get commit.template [92ms] 
2026-02-04 17:13:41.034 [info] > git for-each-ref --format=%(refname)%00%(upstream:short)%00%(objectname)%00%(upstream:track)%00%(upstream:remotename)%00%(upstream:remoteref) --ignore-case refs/heads/dev-atharav refs/remotes/dev-atharav [92ms] 
2026-02-04 17:13:41.110 [info] > git for-each-ref --sort -committerdate --format %(refname)%00%(objectname)%00%(*objectname) [62ms] 
2026-02-04 17:13:41.129 [info] > git status -z -uall [88ms]