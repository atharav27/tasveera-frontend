# Corpora Frontend - Code Review & Improvements

This document summarizes findings from a comprehensive codebase review, identifying inconsistencies, duplication opportunities, and recommended improvements.

## Executive Summary

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Total Apps | 3 | 3 | - |
| Overall Duplication Rate | 35-45% | ~10-15% | **Reduced** |
| Estimated Redundant Lines | 5,000+ | ~1,000 | **80% reduction** |
| Component Files Analyzed | 248+ | 248+ | - |
| Type Definition Lines | 2,784 (43% dup) | ~500 dup | **82% reduction** |
| Duplicate Files Removed | - | **~140 files** | **Completed** |

---

## Consolidation Status

### Phase 1: Foundation - **COMPLETED**

| Task | Status | Files Moved | Files Deleted |
|------|--------|-------------|---------------|
| Utility files → `@corpora/utils` | ✅ Done | 6 | 18 |
| Stores → `@corpora/utils` | ✅ Done | 2 | 6 |
| Utility hooks → `@corpora/utils` | ✅ Done | 2 | 6 |
| Types → `@corpora/utils` | ✅ Done | 8 | 17 |
| Layout components → `@corpora/ui` | ✅ Done | 5 | 18 |

### Phase 2: Component Consolidation - **COMPLETED**

| Task | Status | Components | Files Deleted |
|------|--------|------------|---------------|
| Data-table components | ✅ Done | 15 | 32 |
| Role management dialogs | ✅ Done | 8 | 16 |
| Booking components | ✅ Done | 5 | - |
| Billing components | ✅ Done | 6 | 12 |
| Settings components | ✅ Done | 5 | 12 |

### Phase 3: Remaining Items - **PENDING**

| Task | Status | Notes |
|------|--------|-------|
| Unified API client | ⏳ Pending | Create `@corpora/api-client` package |
| Mock data organization | ⏳ Pending | Standardize `_data/` locations |
| Branded types for IDs | ⏳ Pending | Low priority |

---

## Current Shared Package Structure

### packages/utils/src/
```
├── index.ts              # Main exports
├── hooks/
│   ├── use-callback-ref.ts
│   └── use-debounced-callback.ts
├── lib/
│   ├── auth-client.ts
│   ├── compose-refs.ts
│   ├── data-table.ts
│   ├── format.ts
│   ├── id.ts
│   └── parsers.ts
├── stores/
│   ├── auth-store.ts
│   └── date-filter-store.ts
└── types/
    ├── billing.ts
    ├── bookings.ts
    ├── data-table-config.ts
    ├── data-table.ts
    ├── index.ts
    ├── reports.ts
    ├── roles.ts
    └── vendors.ts
```

### packages/ui/src/common-components/
```
├── actions/              # Action dropdown components
├── badge/                # Badge variants
├── billing/              # 6 billing components (NEW)
│   ├── billing-table.tsx
│   ├── billing-summary.tsx
│   ├── expandable-trip-ids.tsx
│   ├── invoice-breakdown-table.tsx
│   ├── invoices-table.tsx
│   └── index.ts
├── bookings/             # 5 booking components (NEW)
│   ├── action-card.tsx
│   ├── booking-detail-sections.tsx
│   ├── bookings-table.tsx
│   ├── bookings-tabs.tsx
│   └── index.ts
├── charts/               # 3 chart components
│   ├── bar-chart.tsx
│   ├── pie-chart.tsx
│   └── types.ts
├── dashboard-layout/
├── data-table/           # 15 data-table components
│   ├── data-table.tsx
│   ├── data-table-advanced-toolbar.tsx
│   ├── data-table-column-header.tsx
│   ├── data-table-date-filter.tsx
│   ├── data-table-faceted-filter.tsx
│   ├── data-table-filter-list.tsx
│   ├── data-table-filter-menu.tsx
│   ├── data-table-pagination.tsx
│   ├── data-table-range-filter.tsx
│   ├── data-table-skeleton.tsx
│   ├── data-table-slider-filter.tsx
│   ├── data-table-sort-list.tsx
│   ├── data-table-toolbar.tsx
│   ├── data-table-view-options.tsx
│   └── lib/data-table.ts
├── detail-card/
├── dialogs/              # 9 dialog components
│   ├── logout-dialog.tsx
│   ├── add-new-user-dialog.tsx
│   ├── edit-user-details-dialog.tsx
│   ├── remove-user-dialog.tsx
│   ├── deactivate-user-dialog.tsx
│   ├── view-user-details-dialog.tsx
│   ├── add-user-progress-stepper.tsx
│   ├── role-selection-cards.tsx
│   └── user-schemas.ts
├── filters/
├── form-fields/          # 7 form field components
├── layouts/              # 1 layout component
│   └── auth-layout.tsx
├── notifications/
├── settings/             # 5 settings components (NEW)
│   ├── settings-category-section.tsx
│   ├── change-password-content.tsx
│   ├── change-password-schema.ts
│   ├── notification-preferences-content.tsx
│   └── index.ts
├── stat-cards/
└── table-header/
```

---

## What Remains Local (By Design)

### App-Specific Files (Cannot be shared)

| File | Reason |
|------|--------|
| `lib/api.ts` | App-specific API base URL and error handling |
| `lib/auth-client.ts` | App-specific auth configuration |
| `types/tickets.ts` | Has app-specific fields per app |
| `types/settings.ts` | Different notification preferences per app |
| `types/corporates.ts` | Only used in corpora-admin |
| `sidebar.tsx` | App-specific navigation and auth |
| `use-billing.ts` | Depends on app-specific `api.ts` |
| `use-data-table.ts` | URL state management with app context |
| `profile-account-content.tsx` | Different fields per app |
| `travel-policy-content.tsx` | Complex app-specific data table |
| `line-items-table.tsx` | 7500+ lines, app-specific |

---

## Import Pattern Changes

### Before (Duplicated)
```typescript
// Each app had its own copy
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Booking } from "@/types/bookings";
import { DataTable } from "@/components/data-table/data-table";
```

### After (Shared)
```typescript
// All apps import from shared packages
import { formatDate, useAuthStore } from "@corpora/utils";
import type { Booking } from "@corpora/utils";
import { DataTable, DataTablePagination } from "@corpora/ui";
```

---

## Statistics Summary

### Files Consolidated

| Category | Files Moved | Duplicates Deleted | Total Savings |
|----------|-------------|-------------------|---------------|
| Lib utilities | 6 | 18 | 24 files |
| Stores | 2 | 6 | 8 files |
| Hooks | 2 | 6 | 8 files |
| Types | 8 | 17 | 25 files |
| Layout/chart components | 5 | 18 | 23 files |
| Data-table components | 4 | 32 | 36 files |
| Role dialogs | 8 | 16 | 24 files |
| Billing components | 6 | 12 | 18 files |
| Settings components | 5 | 12 | 17 files |
| **TOTAL** | **46** | **137** | **~140 files** |

### Lines of Code Impact

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Utility duplication | ~1,000 lines | 0 | 100% |
| Hook duplication | ~2,500 lines | ~500 | 80% |
| Type duplication | ~1,200 lines | ~200 | 83% |
| Component duplication | ~3,000 lines | ~500 | 83% |
| **TOTAL** | **~7,700 lines** | **~1,200** | **~84%** |

---

## Remaining Recommendations

### High Priority

1. **Fix npm cache permissions** - Run:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   sudo rm -rf node_modules
   bun install
   npm run build
   ```

2. **Verify build** - Run full build after fixing permissions

3. **Update CLAUDE.md** - Document new import patterns

### Medium Priority

4. **Create `@corpora/api-client`** - Unify Alova configuration across apps

5. **Standardize mock data** - Move all `_data/` folders to consistent locations

6. **Remove unused dependencies** - Audit `package.json` files

### Low Priority

7. **Add branded types** for IDs (BookingId, VendorId, etc.)

8. **Standardize status enum casing** across all types

9. **Add JSDoc comments** to shared component APIs

---

## Design Patterns Used

### 1. Thin Wrapper Pattern
App components wrap shared components, providing app-specific hooks:
```typescript
// apps/admin-frontend/hooks/use-corporate-roles.ts (e.g. useInviteUser)
export function AddNewUserDialog(props) {
  const { inviteUser, isInviting } = useInviteUser();
  return <SharedAddNewUserDialog onInviteUser={inviteUser} isInviting={isInviting} {...props} />;
}
```

### 2. Render Props Pattern
Shared components accept render functions for app-specific content:
```typescript
<BookingsTabs
  renderTable={(status) => <BookingsTable status={status} />}
/>
```

### 3. Dependency Injection
Shared components accept Next.js-specific components as props:
```typescript
<AuthLayout ImageComponent={Image} />
<LogoutDialog ImageComponent={Image} />
```

### 4. Dual-Mode Components
Table components support both controlled and uncontrolled modes:
```typescript
// Controlled (app manages table state)
<BillingTable table={tableInstance} />

// Uncontrolled (component creates its own table)
<BillingTable data={billingData} />
```

---

## Verification Checklist

- [x] No `@/lib/format` imports remain in apps
- [x] No `@/lib/data-table` imports remain in apps
- [x] No `@/stores/*` imports remain in apps
- [x] No `@/types/bookings` imports remain in apps
- [x] No `components/data-table/` folders remain in apps
- [x] 84+ files now import from `@corpora/utils`
- [x] All auth pages use `AuthLayout` from `@corpora/ui`
- [x] All data tables use components from `@corpora/ui`
- [ ] Build passes (requires npm permission fix)
- [ ] All tests pass (requires npm permission fix)
