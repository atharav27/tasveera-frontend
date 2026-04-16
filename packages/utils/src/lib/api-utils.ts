import { authClient } from './auth-client';
import { API_BASE_URL } from './api';

/**
 * Converts date strings to API "date" format (YYYY-MM-DD).
 * Strips time from ISO strings (YYYY-MM-DDTHH:mm:ss.sssZ).
 */
export const formatDateForQuery = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    return dateStr;
};

interface DownloadOptions {
    /** The filename to save the downloaded file as */
    filename: string;
    /** Optional query parameters to append to the URL */
    params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Utility to download a CSV file from a protected API endpoint.
 * Handles auth token injection, blob creation, and triggering the browser download.
 */
export async function downloadCsv(endpoint: string, options: DownloadOptions) {
    const { filename, params } = options;

    // 1. Get auth token
    const { data: sessionData } = await authClient.getSession();
    const token = sessionData?.session?.token;

    // 2. Build URL with query parameters
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                // Auto-format dates if they are ISO strings
                const formattedValue = (typeof value === 'string' && value.includes('T') && value.length >= 10)
                    ? formatDateForQuery(value)
                    : String(value);

                if (formattedValue) {
                    queryParams.set(key, formattedValue);
                }
            }
        });
    }

    const query = queryParams.toString();
    const basePath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${basePath}${query ? `?${query}` : ''}`;

    // 3. Fetch data
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Accept': 'text/csv',
        },
        credentials: 'include',
    });

    // 4. Handle response errors
    if (!res.ok) {
        const text = await res.text();
        let message = res.statusText;
        try {
            const json = text ? JSON.parse(text) : null;
            message = (json?.message ?? json?.error ?? text) || message;
        } catch {
            message = text || message;
        }
        throw new Error(message);
    }

    // 5. Trigger browser download
    const csvText = await res.text();
    const blob = new Blob([csvText], { type: 'text/csv' });
    const href = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // 6. Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
}
