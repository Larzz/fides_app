/**
 * Authentication utilities
 * Handles token storage and retrieval
 */

const AUTH_TOKEN_KEY = 'auth_token'

/**
 * Set authentication token in cookies
 */
export function setAuthToken(token: string, rememberMe: boolean = false) {
	const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
	document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/**
 * Get authentication token from cookies
 */
export function getAuthToken(): string | null {
	if (typeof document === 'undefined') return null

	const cookies = document.cookie.split(';')
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=')
		if (name === AUTH_TOKEN_KEY) {
			return value || null
		}
	}
	return null
}

/**
 * Remove authentication token
 */
export function removeAuthToken() {
	document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated(): boolean {
	return !!getAuthToken()
}

