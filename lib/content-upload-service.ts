import { cookies } from 'next/headers'
import { authPaths } from '@/lib/api-paths'
import { backendFetch, readJsonSafe } from '@/lib/api-client'
import { extractData, extractPaginatedList, type PaginationInfo } from '@/lib/api-parse'
import type { DashboardUserBrief } from '@/lib/dashboard-service'

interface FilesStatsPayload {
	archived_count?: number
	active_count?: number
}

export interface ContentFileRow {
	id: number
	title: string
	category: string
	uploadedBy: string
	sharedWith: string
	uploadDateLabel: string
}

export interface ContentUploadPageData {
	userName: string
	archivedCount: number | null
	files: {
		items: ContentFileRow[]
		pagination: PaginationInfo
	}
}

function sharedLabel(file: {
	shares?: Array<{ share_all_employees?: boolean }>
}): string {
	const shares = file.shares
	if (!Array.isArray(shares) || shares.length === 0) {
		return '—'
	}
	if (shares.some((s) => s.share_all_employees)) {
		return 'Company-wide'
	}
	return shares.length === 1 ? '1 recipient' : `${shares.length} recipients`
}

function formatUploadDate(iso: string | null | undefined): string {
	if (!iso) {
		return '—'
	}
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) {
		return '—'
	}
	return d.toLocaleDateString('en-AE', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

export async function loadContentUploadPageData(
	perPage: number = 15,
): Promise<ContentUploadPageData> {
	const emptyPagination: PaginationInfo = {
		total: 0,
		currentPage: 1,
		lastPage: 1,
		perPage,
	}

	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value

	const empty: ContentUploadPageData = {
		userName: 'there',
		archivedCount: null,
		files: { items: [], pagination: emptyPagination },
	}

	if (!token) {
		return empty
	}

	const listQuery = new URLSearchParams({
		tab: 'all',
		per_page: String(perPage),
		sort_by: 'created_at',
		sort_dir: 'desc',
	})

	const [meRes, statsRes, listRes] = await Promise.all([
		backendFetch(authPaths.me, { method: 'GET', token }),
		backendFetch('/files/stats?tab=all', { method: 'GET', token }),
		backendFetch(`/files?${listQuery.toString()}`, { method: 'GET', token }),
	])

	const meJson = meRes.ok ? await readJsonSafe(meRes) : null
	const me = extractData<DashboardUserBrief>(meJson)
	const userName = me?.name?.trim() || 'there'

	const statsJson = statsRes.ok ? await readJsonSafe(statsRes) : null
	const stats = extractData<FilesStatsPayload>(statsJson)
	const archivedCount =
		typeof stats?.archived_count === 'number' ? stats.archived_count : null

	const listRaw = listRes.ok ? await readJsonSafe(listRes) : null
	const parsed = extractPaginatedList<Record<string, unknown>>(listRaw)

	const items: ContentFileRow[] = parsed.items.map((row) => {
		const uploader = row.uploader as DashboardUserBrief | undefined
		const created =
			typeof row.created_at === 'string' ? row.created_at : null
		return {
			id: typeof row.id === 'number' ? row.id : 0,
			title: typeof row.title === 'string' ? row.title : '—',
			category:
				typeof row.category === 'string' ? row.category : '—',
			uploadedBy: uploader?.name ?? '—',
			sharedWith: sharedLabel(
				row as { shares?: Array<{ share_all_employees?: boolean }> },
			),
			uploadDateLabel: formatUploadDate(created),
		}
	})

	return {
		userName,
		archivedCount,
		files: {
			items,
			pagination: parsed.pagination,
		},
	}
}
