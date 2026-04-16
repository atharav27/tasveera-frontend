import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';

/**
 * Configuration options for creating an API client
 */
export interface ApiClientConfig {
    /** Base URL for API requests */
    baseURL: string;
    /** Function to retrieve the auth token asynchronously */
    getAuthToken: () => Promise<string | null | undefined>;
    /** Optional error handler callback */
    onError?: (error: Error, context: ErrorContext) => void;
    /** Enable debug logging (defaults to true in development) */
    debug?: boolean;
}

/**
 * Context provided to the error handler
 */
export interface ErrorContext {
    status?: number;
    statusText?: string;
    url?: string;
    response?: unknown;
}

/**
 * Extract error message from various response formats
 */
function extractErrorMessage(obj: unknown): string {
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object' && obj !== null) {
        const o = obj as Record<string, unknown>;
        // Handle nested error object: { error: { message: "..." } }
        if (typeof o.error === 'object' && o.error !== null) {
            const errorObj = o.error as Record<string, unknown>;
            if (typeof errorObj.message === 'string') return errorObj.message;
        }
        // Handle direct error string
        if (typeof o.error === 'string') return o.error;
        // Handle direct message
        if (typeof o.message === 'string') return o.message;
        // Return stringified object for debugging
        return JSON.stringify(obj);
    }
    return String(obj);
}

/**
 * Creates a configured Alova API client instance
 *
 * @param config - Configuration options for the API client
 * @returns Configured Alova instance
 *
 * @example
 * ```ts
 * import { createApiClient } from '@corpora/api-client';
 * import { authClient } from './auth-client';
 *
 * export const alovaInstance = createApiClient({
 *     baseURL: 'http://localhost:3004',
 *     getAuthToken: async () => {
 *         const { data } = await authClient.getSession();
 *         return data?.session?.token;
 *     },
 *     onError: (error, context) => {
 *         // Custom error handling (e.g., toast notifications)
 *         console.error('API Error:', error.message);
 *     }
 * });
 * ```
 */
export function createApiClient(config: ApiClientConfig) {
    const { baseURL, getAuthToken, onError, debug = process.env.NODE_ENV === 'development' } = config;

    return createAlova({
        baseURL,
        statesHook: ReactHook,
        requestAdapter: adapterFetch(),

        async beforeRequest(method) {
            const token = await getAuthToken();

            method.config.headers = {
                ...method.config.headers,
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            // Ensure cookies are sent (needed for better-auth)
            method.config.credentials = 'include';

            // Log request details for debugging
            if (debug) {
                console.log('API Request:', {
                    method: method.type,
                    url: method.url,
                    headers: method.config.headers,
                    body: method.data
                });
            }
        },

        responded: {
            onSuccess: async (response) => {
                let json;
                const responseText = await response.text();

                try {
                    json = responseText ? JSON.parse(responseText) : null;
                } catch {
                    if (debug) {
                        console.error('Failed to parse response as JSON:', responseText);
                    }
                    json = { message: responseText || 'Invalid response from server' };
                }

                if (response.status >= 400) {
                    // Handle empty or null responses
                    if (!json || (typeof json === 'object' && Object.keys(json).length === 0)) {
                        const statusMessage = `${response.status} ${response.statusText || 'Error'}`;
                        if (debug) {
                            console.error(`API Error: ${statusMessage} - ${response.url}`);
                        }
                        const error = new Error(statusMessage);
                        onError?.(error, {
                            status: response.status,
                            statusText: response.statusText,
                            url: response.url,
                            response: json
                        });
                        throw error;
                    }

                    const errorMessage = extractErrorMessage(json) || response.statusText || `Error ${response.status}`;
                    const errorDetails = json.details || json.errors || '';

                    if (debug) {
                        console.group(`API Error: ${response.status} ${response.url}`);
                        console.error('Message:', errorMessage);
                        if (errorDetails) {
                            console.error('Details:', typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails);
                        }
                        console.groupEnd();
                    }

                    const error = new Error(errorMessage);
                    onError?.(error, {
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                        response: json
                    });
                    throw error;
                }

                // Return null for empty successful responses (e.g., 204 No Content)
                return json;
            },

            onError: (err) => {
                // Global error handling
                if (debug) {
                    console.error('API Error:', err);
                }
                onError?.(err instanceof Error ? err : new Error(String(err)), {});
                throw err;
            }
        }
    });
}
