
import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    withCredentials: true
})


export function getApiErrorMessage(
    error: unknown,
    fallback = 'Something went wrong. Please try again.',
): string {
    if (!axios.isAxiosError(error)) {
        return fallback
    }

    // No response at all = server down, network error, or blocked by CORS
    if (!error.response) {
        return 'Cannot reach the server. Check your connection and try again.'
    }

    const status = error.response.status
    const data = error.response.data as { message?: string | string[] } | undefined
    const serverMessage = Array.isArray(data?.message) ? data?.message[0] : data?.message

    switch (status) {
        case 400:
            return serverMessage ?? 'Invalid input. Please check the form.'
        case 401:
            return 'Invalid email or password.'
        case 403:
            return 'You do not have permission to do that.'
        case 404:
            return 'Service unavailable. Please try again later.'
        case 409:
            return serverMessage ?? 'Could not complete that request. Please try again.'
        case 429:
            return 'Too many attempts. Please wait a moment and try again.'
        default:
            if (status >= 500) return 'Server error. Please try again later.'
            return serverMessage ?? fallback
    }
}