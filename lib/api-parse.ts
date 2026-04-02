import type { ApiEnvelope } from './api-client'

export interface PaginationInfo {
	total: number
	currentPage: number
	lastPage: number
	perPage: number
}

const emptyPagination: PaginationInfo = {
	total: 0,
	currentPage: 1,
	lastPage: 1,
	perPage: 15,
}

/**
 * Normalizes Laravel ApiResponse bodies: `data` may be a plain array (files
 * index) or a LengthAwarePaginator object with a nested `data` array.
 */
export function extractPaginatedList<T>(raw: unknown): {
	items: T[]
	pagination: PaginationInfo
} {
	if (!raw || typeof raw !== 'object') {
		return { items: [], pagination: emptyPagination }
	}

	const root = raw as ApiEnvelope<unknown> & {
		meta?: { pagination?: Record<string, number> }
	}

	const envelopePagination = root.meta?.pagination
	const d = root.data

	if (Array.isArray(d)) {
		return {
			items: d as T[],
			pagination: {
				total: envelopePagination?.total ?? d.length,
				currentPage: envelopePagination?.current_page ?? 1,
				lastPage: envelopePagination?.last_page ?? 1,
				perPage: envelopePagination?.per_page ?? (d.length || 15),
			},
		}
	}

	if (d && typeof d === 'object') {
		const p = d as Record<string, unknown>
		const items = Array.isArray(p.data) ? (p.data as T[]) : []
		return {
			items,
			pagination: {
				total: typeof p.total === 'number' ? p.total : items.length,
				currentPage:
					typeof p.current_page === 'number' ? p.current_page : 1,
				lastPage: typeof p.last_page === 'number' ? p.last_page : 1,
				perPage: typeof p.per_page === 'number' ? p.per_page : 15,
			},
		}
	}

	return { items: [], pagination: emptyPagination }
}

export function extractData<T>(raw: unknown): T | null {
	if (!raw || typeof raw !== 'object') {
		return null
	}
	const root = raw as ApiEnvelope<T>
	if (root.data === undefined) {
		return null
	}
	return root.data
}
