/**
 * Shared utility functions for formatting stat card values and trends.
 * Used across dashboard, bookings, tickets, vendors, roles, and billing pages.
 */

// --- Types ---

export interface StatMetric {
    /** Current value of the metric */
    value: number;
    /** Absolute change from previous period */
    change: number;
    /** Percentage change from previous period */
    percentage: number;
}

export type TrendType = "positive" | "negative" | "neutral";

export interface TrendInfo {
    value: string;
    label: string;
    type: TrendType;
}

// --- Formatting Options ---

export interface FormatValueOptions {
    /** If true, appends % to the value */
    isPercentage?: boolean;
    /** Number of decimal places for percentage values */
    decimals?: number;
}

export interface FormatTrendOptions {
    /** If true, shows percentage change instead of absolute change */
    isPercentage?: boolean;
    /** If true, inverts the logic (increase = negative, decrease = positive) */
    invertLogic?: boolean;
    /** Custom label text (default: "from last month") */
    label?: string;
}

// --- Helper Functions ---

/**
 * Formats a stat value for display.
 * Adds commas for large numbers and % suffix for percentages.
 */
export function formatStatValue(
    value: number,
    options: FormatValueOptions = {}
): string {
    const { isPercentage = false, decimals = 1 } = options;

    if (isPercentage) {
        return `${value.toFixed(decimals)}%`;
    }
    return value.toLocaleString();
}

/**
 * Formats a stat metric value for display.
 * Convenience wrapper that accepts a StatMetric object.
 */
export function formatMetricValue(
    metric: StatMetric,
    options: FormatValueOptions = {}
): string {
    return formatStatValue(metric.value, options);
}

/**
 * Formats the trend/change value with +/- prefix.
 */
export function formatTrendValue(
    metric: StatMetric,
    options: FormatValueOptions = {}
): string {
    const { isPercentage = false, decimals = 1 } = options;
    const prefix = metric.change >= 0 ? "+" : "";

    if (isPercentage) {
        return `${prefix}${metric.percentage.toFixed(decimals)}%`;
    }
    return `${prefix}${metric.change}`;
}

/**
 * Determines the trend type (positive/negative/neutral) based on change value.
 * @param invertLogic - If true, increase = negative (useful for metrics like "pending approvals")
 */
export function getTrendType(
    metric: StatMetric,
    invertLogic = false
): TrendType {
    if (metric.change === 0) return "neutral";
    const isPositive = metric.change > 0;

    if (invertLogic) {
        return isPositive ? "negative" : "positive";
    }
    return isPositive ? "positive" : "negative";
}

/**
 * Creates a complete trend info object for StatCard components.
 * Combines value formatting and type determination.
 */
export function formatTrend(
    change: number,
    percentage: number,
    options: FormatTrendOptions = {}
): TrendInfo {
    const {
        isPercentage = false,
        invertLogic = false,
        label = "from last month",
    } = options;

    const isPositiveChange = change >= 0;
    const prefix = isPositiveChange ? "+" : "";

    // Determine trend type
    let type: TrendType = "neutral";
    if (change !== 0) {
        if (invertLogic) {
            type = isPositiveChange ? "negative" : "positive";
        } else {
            type = isPositiveChange ? "positive" : "negative";
        }
    }

    return {
        value: isPercentage
            ? `${prefix}${percentage.toFixed(1)}%`
            : `${prefix}${change}`,
        label: `${Math.abs(percentage).toFixed(0)}% ${label}`,
        type,
    };
}

/**
 * Creates a trend info object from a StatMetric.
 * Convenience wrapper for formatTrend.
 */
export function formatMetricTrend(
    metric: StatMetric,
    options: FormatTrendOptions = {}
): TrendInfo {
    return formatTrend(metric.change, metric.percentage, options);
}
