import { serverApiUrl } from './api-config'

export interface ApiEnvelope<T = unknown> {
	success?: boolean
	message?: string
	data?: T
	errors?: Record<string, string[]>
	meta?: Record<string, unknown>
}

export class ApiRequestError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly body: unknown,
	) {
		super(message)
		this.name = 'ApiRequestError'
	}
}

export async function readJsonSafe(response: Response): Promise<unknown> {
	const text = await response.text()
	if (!text) {
		return null
	}
	try {
		return JSON.parse(text) as unknown
	} catch {
		return null
	}
}

export function messageFromApiBody(body: unknown): string {
	if (!body || typeof body !== 'object') {
		return 'Request failed'
	}
	const o = body as Record<string, unknown>
	if (typeof o.message === 'string' && o.message) {
		return o.message
	}
	const errors = o.errors
	if (errors && typeof errors === 'object') {
		const parts: string[] = []
		for (const v of Object.values(errors as Record<string, unknown>)) {
			if (Array.isArray(v)) {
				parts.push(...v.filter((x) => typeof x === 'string'))
			}
		}
		if (parts.length) {
			return parts.join(' ')
		}
	}
	return 'Request failed'
}

type BackendFetchInit = RequestInit & {
	token?: string | null
	/**
	 * Abort after this many ms when `signal` is not passed.
	 * Pass `0` to wait indefinitely (not recommended).
	 */
	timeoutMs?: number
}

/**
 * Server-side fetch to the Laravel API (Sanctum JSON).
 */
export async function backendFetch(
	path: string,
	init: BackendFetchInit = {},
): Promise<Response> {
	const url = serverApiUrl(path)
	const headers = new Headers(init.headers)

	if (!headers.has('Accept')) {
		headers.set('Accept', 'application/json')
	}

	if (
		!headers.has('Content-Type') &&
		init.body &&
		typeof init.body === 'string'
	) {
		headers.set('Content-Type', 'application/json')
	}

	const {
		token,
		timeoutMs = 30_000,
		signal: userSignal,
		...rest
	} = init

	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	const signal =
		userSignal ??
		(timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined)

	return fetch(url, {
		...rest,
		headers,
		...(signal ? { signal } : {}),
		cache: 'no-store',
	})
}
