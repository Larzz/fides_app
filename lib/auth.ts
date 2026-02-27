/**
 * Authentication utilities
 * Handles token storage and retrieval for Sanctum-based authentication
 */

const AUTH_TOKEN_KEY = 'auth_token'

/**
 * Set authentication token in cookies (client-side only)
 * Note: For production, tokens should be set server-side as HTTP-only cookies
 * This is kept for backward compatibility
 */
export function setAuthToken(token: string, rememberMe: boolean = false) {
	if (typeof document === 'undefined') return

	const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
	document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/**
 * Get authentication token from cookies (client-side only)
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
 * Remove authentication token (client-side)
 */
export function removeAuthToken() {
	if (typeof document === 'undefined') return
	document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`
}

/**
 * Check if user is authenticated (client-side)
 * Note: This is a basic check. For secure validation, use server-side middleware
 */
export function isAuthenticated(): boolean {
	return !!getAuthToken()
}

/**
 * Get authentication headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
	const token = getAuthToken()
	return {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	}
}

/**
 * Logout user (client-side)
 * Calls the logout API and clears local auth state
 */
export async function logout(): Promise<void> {
	try {
		await fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		})
	} catch (error) {
		console.error('Logout error:', error)
	} finally {
		// Clear client-side token regardless of API call result
		removeAuthToken()
		// Redirect to login page
		if (typeof window !== 'undefined') {
			window.location.href = '/login'
		}
	}
}

