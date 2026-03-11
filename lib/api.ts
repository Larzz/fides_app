/**
 * API base URL for the backend.
 * Use API_URL env var to override. Defaults by environment:
 * - development: http://127.0.0.1:8000
 * - production: https://api.creativouae.com
 */
export const getApiUrl = (): string => {
	const envUrl = process.env.API_URL
	if (envUrl) return envUrl
	return process.env.NODE_ENV === 'development'
		? 'http://127.0.0.1:8000'
		: 'https://api.creativouae.com'
}
