/**
 * Environment-aware API base URL (includes the `/api` prefix).
 *
 * Server: API_BASE_URL (preferred) or legacy API_URL (origin only; `/api` is appended).
 * Client: NEXT_PUBLIC_API_BASE_URL or VITE_API_BASE_URL (bundled at build time).
 */

const DEFAULT_DEV_BASE = 'http://127.0.0.1:8000/api'
const DEFAULT_PROD_BASE = 'https://api.creativouae.com/api'

function trimTrailingSlashes(url: string): string {
	return url.replace(/\/+$/, '')
}

/**
 * Node's fetch often resolves `localhost` to IPv6 (::1) first. PHP artisan
 * serve typically listens on 127.0.0.1 only, so requests can hang until TCP
 * times out. Postman may use 127.0.0.1 explicitly and appear to "work."
 */
function preferIpv4Loopback(url: string): string {
	try {
		const u = new URL(url)
		if (u.hostname === 'localhost') {
			u.hostname = '127.0.0.1'
		}
		return u.toString().replace(/\/+$/, '')
	} catch {
		return url
	}
}

function ensureApiSuffix(origin: string): string {
	const base = trimTrailingSlashes(origin)
	if (base.toLowerCase().endsWith('/api')) {
		return base
	}
	return `${base}/api`
}

function resolveServerRaw(): string {
	const explicit = process.env.API_BASE_URL?.trim()
	if (explicit) {
		return explicit
	}

	const legacy = process.env.API_URL?.trim()
	if (legacy) {
		return ensureApiSuffix(legacy)
	}

	return process.env.NODE_ENV === 'development'
		? DEFAULT_DEV_BASE
		: DEFAULT_PROD_BASE
}

/**
 * Base URL for server-only code (Route Handlers, Server Components, middleware).
 */
export function getServerApiBaseUrl(): string {
	const raw = trimTrailingSlashes(resolveServerRaw())
	return preferIpv4Loopback(raw)
}

/**
 * Base URL for browser code (client components). Uses only public env vars.
 */
export function getPublicApiBaseUrl(): string {
	const fromEnv =
		process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
		process.env.VITE_API_BASE_URL?.trim()

	if (fromEnv) {
		return trimTrailingSlashes(ensureApiSuffix(fromEnv))
	}

	return process.env.NODE_ENV === 'development'
		? DEFAULT_DEV_BASE
		: DEFAULT_PROD_BASE
}

/**
 * Build an absolute backend URL from a path like `/login` or `/dashboard`.
 */
export function serverApiUrl(path: string): string {
	const base = getServerApiBaseUrl()
	const p = path.startsWith('/') ? path : `/${path}`
	return `${base}${p}`
}
