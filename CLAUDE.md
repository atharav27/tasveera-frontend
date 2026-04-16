# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Corpora Corporate Frontend - a corporate transportation management platform. Part of the Corpora ecosystem connecting Corporates, Vendors, Drivers, and Admin.

## Build & Development Commands

```bash
# Development (all apps via Turborepo)
npm run dev

# Production build
npm run build

# Linting and type checking
npm run lint
npm run typecheck

# Run commands for specific app
npm run dev --workspace=@corpora/admin-frontend
npm run build --workspace=@corpora/admin-frontend
```

The main app runs on `http://localhost:3000`. Backend API expected at `http://localhost:3004`.

## Architecture

### Monorepo Structure (Turborepo)

```
apps/
  admin-frontend/          # Next.js 16 app (admin: dashboard, tickets, settings)
  corpora-admin/          # Admin dashboard application
  vendor-frontend/        # Vendor-facing application
packages/
  ui/                     # Shared React components (@corpora/ui)
  utils/                  # Shared utilities, hooks, stores, types (@corpora/utils)
  config-eslint/          # Shared ESLint config
  config-tailwind/        # Shared Tailwind config
  config-typescript/      # Shared TypeScript configs
```

### Tech Stack

- **Framework**: Next.js 16 with App Router, React 19
- **State Management**: Zustand stores in `@corpora/utils`
- **Data Fetching**: Alova (`lib/api.ts`) with automatic auth token injection
- **Authentication**: better-auth (`lib/auth-client.ts`)
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack React Table with `useDataTable` hook from `@corpora/utils`
- **UI Components**: shadcn/ui (radix-maia style) in `@corpora/ui`
- **Styling**: Tailwind CSS 4

### Key Patterns

**Client vs Server Components**: Use `"use client"` directive for components with hooks, forms, or interactivity. Server components are default.

**Path Aliases**:
- `@/*` → app root
- `@corpora/ui` → shared UI package
- `@corpora/utils` → shared utilities, hooks, stores, types

**API Layer**: All API calls go through `lib/api.ts` which auto-injects auth tokens from better-auth session. Use Alova hooks (`useRequest`, `useWatcher`) for data fetching.

**Data Tables**: Use the `useDataTable` hook from `@corpora/utils` for tables with sorting, filtering, and pagination. Column definitions are type-safe.

### Application Routes (admin-frontend)

```
app/
  (auth)/                 # Auth pages (login, forgot-password, reset-password)
  page.tsx                # Dashboard (/)
  settings/               # Settings
  tickets/                # Support tickets list and [ticketId] detail
```

### Types

Booking-related types are in `@corpora/utils`. Key types:
- `VehicleClass`: hatchback, sedan, suv, etc.
- `BookingStatus`: draft, requested, vendor_assigned, confirmed, completed, cancelled, etc.
- `RideType`: local, outstation, package

## Shared Packages

### Overview

#### `@corpora/utils`

Contains all shared logic, state, and type definitions:

- **Utilities**: `cn()`, `formatDate()`, `formatCurrency()`, `generateId()`, `formatRelativeTime()`
- **Hooks**: `useCallbackRef`, `useDebouncedCallback`, `useDataTable`, `useControllableState`
- **Stores**: `useAuthStore`, `useDateFilterStore`, `useOrgStore`
- **Types**: `Booking`, `VehicleClass`, `BookingStatus`, `RideType`, `Driver`, `Vehicle`, `VehicleCategory`
- **Constants**: `vehicleCategories`, `BOOKING_STATUS_CONFIG`

#### `@corpora/ui`

Contains all shared React components:

- **Data Display**: `DataTable`, `DataTablePagination`, `DataTableToolbar`
- **Dialogs**: `AssignVendorDialog`, `BookingDetailsDialog`, `CancelBookingDialog`, `ReassignVendorDialog`
- **Billing**: `BillingOverviewCards`, `BillingTable`, `InvoiceDetailTable`
- **Bookings**: `BookingActionButtons`, `BookingOverviewCards`, `BookingPriceCard`, `BookingStatusBadge`
- **Settings**: `MembersSettings`, `OrgBillingSettings`, `OrgGeneralSettings`
- **Charts**: `AreaChart`, `BarChart`, `DonutChart`
- **Layouts**: `AuthLayout`, `TopNav`
- **Base UI**: All shadcn/ui primitives (Button, Card, Dialog, Input, etc.)

### Import Patterns

#### Types

```typescript
// Before (app-specific)
import type { Booking, VehicleClass, BookingStatus } from "@/types/bookings"

// After (shared package)
import type { Booking, VehicleClass, BookingStatus } from "@corpora/utils"
```

#### Utilities

```typescript
// Before (app-specific)
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/format"

// After (shared package)
import { cn, formatDate, formatCurrency, generateId } from "@corpora/utils"
```

#### Stores

```typescript
// Before (app-specific)
import { useAuthStore } from "@/stores/auth-store"
import { useDateFilterStore } from "@/lib/store/date-filter-store"

// After (shared package)
import { useAuthStore, useDateFilterStore, useOrgStore } from "@corpora/utils"
```

#### Hooks

```typescript
// Before (app-specific)
import { useDataTable } from "@/hooks/use-data-table"
import { useCallbackRef } from "@/hooks/use-callback-ref"

// After (shared package)
import { useDataTable, useCallbackRef, useDebouncedCallback } from "@corpora/utils"
```

#### Components

```typescript
// Before (app-specific)
import { DataTable } from "@/components/data-table"
import { BookingDetailsDialog } from "@/components/bookings/booking-details-dialog"

// After (shared package)
import { DataTable, BookingDetailsDialog, AuthLayout, BillingTable } from "@corpora/ui"
```

### What Remains App-Specific

These items should NOT be moved to shared packages as they contain app-specific configuration:

- **`lib/api.ts`** - App-specific API base URL and Alova configuration
- **`lib/auth-client.ts`** - App-specific better-auth setup
- **`types/tickets.ts`**, **`types/settings.ts`** - Types specific to one app
- **`sidebar.tsx`** - App-specific navigation structure
- **`app/`** - All route pages and layouts

### Design Patterns

#### Thin Wrapper Pattern for Dialogs

Shared dialogs use thin wrappers to minimize duplication while allowing app-specific API calls:

```typescript
// In shared package (@corpora/ui)
export function AssignVendorDialogContent({
  booking,
  onAssign
}: {
  booking: Booking
  onAssign: (vendorId: string) => Promise<void>
}) {
  // Shared UI and logic
}

// In app
export function AssignVendorDialog({ booking }: { booking: Booking }) {
  const handleAssign = async (vendorId: string) => {
    await api.assignVendor(booking.id, vendorId) // App-specific API call
  }
  return <AssignVendorDialogContent booking={booking} onAssign={handleAssign} />
}
```

#### Render Props for Flexible Components

Components that need app-specific rendering use render props:

```typescript
// Shared component accepts render functions
<DataTable
  columns={columns}
  data={data}
  renderToolbar={(table) => <CustomToolbar table={table} />}
  renderEmpty={() => <CustomEmptyState />}
/>
```

#### Dependency Injection for Next.js Components

Next.js-specific components (like `Image`) are passed as props to avoid framework coupling:

```typescript
// Shared component
export function UserAvatar({
  src,
  ImageComponent
}: {
  src: string
  ImageComponent?: typeof Image
}) {
  const Img = ImageComponent || 'img'
  return <Img src={src} alt="avatar" />
}

// In app
import Image from "next/image"
<UserAvatar src={user.avatar} ImageComponent={Image} />
```

## Working with Shared Packages

When modifying `@corpora/ui` or `@corpora/utils`:

1. Make changes in `packages/ui/src/` or `packages/utils/src/`
2. Export from the package's `index.ts`
3. Import in app as `@corpora/ui` or `@corpora/utils`
4. Next.js transpiles these packages automatically (`transpilePackages` in next.config.ts)

### Adding New Exports

```typescript
// packages/utils/src/index.ts
export { myNewFunction } from "./lib/my-new-function"
export type { MyNewType } from "./types/my-new-type"

// packages/ui/src/index.ts
export { MyNewComponent } from "./components/my-new-component"
```

### Package Structure

```
packages/utils/src/
  hooks/           # Reusable React hooks
  lib/             # Utility functions
  stores/          # Zustand stores
  types/           # TypeScript type definitions
  index.ts         # Main export file

packages/ui/src/
  components/      # React components organized by feature
    billing/
    bookings/
    charts/
    data-table/
    dialogs/
    layouts/
    settings/
    ui/            # Base shadcn/ui primitives
  index.ts         # Main export file
```
