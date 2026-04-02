import { cookies } from 'next/headers'
import {
	backendFetch,
	readJsonSafe,
	type ApiEnvelope,
} from './api-client'
import { pageDataPaths } from './api-paths'

const FIVE_SECONDS_MS = 5000

/**
 * Maps page keys to Laravel `routes/api.php` endpoints (relative to `/api`).
 */
const PAGE_KEY_PATH: Record<string, string> = {
	dashboard: pageDataPaths.dashboard,
	'dashboard-details': pageDataPaths.dashboard,
	approvals: pageDataPaths.approvals,
	clients: pageDataPaths.clientsMetrics,
	employees: pageDataPaths.employeesMetrics,
	'system-logs': pageDataPaths.systemLogsStats,
	'content-upload': pageDataPaths.content,
	'work-policies': pageDataPaths.workToolsStats,
	'access-management': pageDataPaths.accessStats,
	'tools-subscriptions': pageDataPaths.tools,
}

export async function getFidesPageData<T>(
	pageKey: string,
	fallback: T,
): Promise<T> {
	const path = PAGE_KEY_PATH[pageKey]
	if (!path) {
		return fallback
	}

	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('auth_token')?.value
		if (!token) {
			return fallback
		}

		const response = await backendFetch(path, {
			method: 'GET',
			token,
			signal: AbortSignal.timeout(FIVE_SECONDS_MS),
		})

		if (!response.ok) {
			return fallback
		}

		const payload = (await readJsonSafe(response)) as ApiEnvelope<T> | null
		if (payload?.data !== undefined) {
			return payload.data as T
		}

		return fallback
	} catch {
		return fallback
	}
}
