import type { ApiEnvelope } from './api-client'

type LoginPayload = ApiEnvelope<{
	token?: string
	access_token?: string
	accessToken?: string
	user?: unknown
}> & {
	token?: string
	access_token?: string
	accessToken?: string
}

/**
 * Extract bearer token from Laravel ApiResponse-style login JSON.
 */
export function extractTokenFromLoginBody(data: unknown): string | null {
	if (!data || typeof data !== 'object') {
		return null
	}

	const root = data as LoginPayload
	const nested = root.data && typeof root.data === 'object' ? root.data : null

	const raw =
		root.token ??
		root.access_token ??
		root.accessToken ??
		nested?.token ??
		nested?.access_token ??
		nested?.accessToken

	if (typeof raw !== 'string' || !raw.trim()) {
		return null
	}
	return raw.trim()
}
