import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Stores
export { useAuthStore } from "./stores/auth-store";
export { useDateFilterStore, getFilterLabel } from "./stores/date-filter-store";
export type { DateFilterOption } from "./stores/date-filter-store";

// Export all shared types
export * from './types';

// Hooks
export { useCallbackRef } from "./hooks/use-callback-ref";
export { useDebouncedCallback } from "./hooks/use-debounced-callback";

// Lib utilities
export { formatDate } from "./lib/format";
export { composeRefs, useComposedRefs } from "./lib/compose-refs";
export { generateId } from "./lib/id";
export { createCorporaAuthClient } from "./lib/auth-client";
export type { AuthClientConfig } from "./lib/auth-client";
export { getSortingStateParser, getFiltersStateParser } from "./lib/parsers";
export {
  getColumnPinningStyle,
  getFilterOperators,
  getDefaultFilterOperator,
  getValidFilters
} from "./lib/data-table";

export { formatDateForQuery, downloadCsv } from "./lib/api-utils";
