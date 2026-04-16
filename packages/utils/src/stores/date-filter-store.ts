import { create } from 'zustand';
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
} from 'date-fns';

export type DateFilterOption = 'today' | 'this_week' | 'this_month' | 'this_year';

interface DateRange {
    fromDate: string;
    toDate: string;
}

interface DateFilterState {
    selectedFilter: DateFilterOption;
    setFilter: (filter: DateFilterOption) => void;
    getDateRange: () => DateRange;
}

const filterLabels: Record<DateFilterOption, string> = {
    today: 'Today',
    this_week: 'This Week',
    this_month: 'This Month',
    this_year: 'This Year',
};

export const getFilterLabel = (filter: DateFilterOption): string => filterLabels[filter];

const calculateDateRange = (filter: DateFilterOption): DateRange => {
    const now = new Date();

    switch (filter) {
        case 'today':
            return {
                fromDate: startOfDay(now).toISOString(),
                toDate: endOfDay(now).toISOString(),
            };
        case 'this_week':
            return {
                fromDate: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
                toDate: endOfWeek(now, { weekStartsOn: 1 }).toISOString(),
            };
        case 'this_month':
            return {
                fromDate: startOfMonth(now).toISOString(),
                toDate: endOfMonth(now).toISOString(),
            };
        case 'this_year':
            return {
                fromDate: startOfYear(now).toISOString(),
                toDate: endOfYear(now).toISOString(),
            };
        default:
            return {
                fromDate: startOfMonth(now).toISOString(),
                toDate: endOfMonth(now).toISOString(),
            };
    }
};

export const useDateFilterStore = create<DateFilterState>((set, get) => ({
    selectedFilter: 'this_month',
    setFilter: (filter) => set({ selectedFilter: filter }),
    getDateRange: () => calculateDateRange(get().selectedFilter),
}));
