import { getApiUrl } from './api'

interface FidesApiEnvelope<T> {
	success?: boolean
	data?: T
}

const FIVE_SECONDS_MS = 5000

export async function getFidesPageData<T>(
	pageKey: string,
	fallback: T,
): Promise<T> {
	try {
		const response = await fetch(`${getApiUrl()}/fides_api/${pageKey}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			cache: 'no-store',
			next: { revalidate: 0 },
			signal: AbortSignal.timeout(FIVE_SECONDS_MS),
		})

		if (!response.ok) {
			return fallback
		}

		const payload: FidesApiEnvelope<T> = await response.json()
		if (payload?.data !== undefined) {
			return payload.data
		}

		return fallback
	} catch {
		return fallback
	}
}
