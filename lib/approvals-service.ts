import { cookies } from 'next/headers'
import { authPaths } from '@/lib/api-paths'
import { backendFetch, readJsonSafe } from '@/lib/api-client'
import {
	extractData,
	extractPaginatedList,
	type PaginationInfo,
} from '@/lib/api-parse'
import {
	statusBadgeClass,
	type DashboardMetrics,
	type DashboardUserBrief,
} from '@/lib/dashboard-service'

export interface ApprovalsTableRow {
	id: number
	type: string
	userName: string
	details: string
	submittedLabel: string
	status: string
	statusBadgeClass: string
}

export interface ApprovalsPageData {
	userName: string
	pendingCount: number | null
	approvals: {
		items: ApprovalsTableRow[]
		pagination: PaginationInfo
	}
}

function formatWhen(iso: string | null | undefined): string {
	if (!iso) {
		return '—'
	}
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) {
		return '—'
	}
	return d.toLocaleString('en-AE', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export async function loadApprovalsPageData(
	perPage: number = 15,
): Promise<ApprovalsPageData> {
	const emptyPagination: PaginationInfo = {
		total: 0,
		currentPage: 1,
		lastPage: 1,
		perPage,
	}

	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value
	if (!token) {
		return {
			userName: 'there',
			pendingCount: null,
			approvals: { items: [], pagination: emptyPagination },
		}
	}

	const [meRes, metricsRes, listRes] = await Promise.all([
		backendFetch(authPaths.me, { method: 'GET', token }),
		backendFetch('/dashboard', { method: 'GET', token }),
		backendFetch(`/approvals?per_page=${perPage}`, { method: 'GET', token }),
	])

	const meJson = meRes.ok ? await readJsonSafe(meRes) : null
	const me = extractData<DashboardUserBrief>(meJson)
	const userName = me?.name?.trim() || 'there'

	const metricsJson = metricsRes.ok ? await readJsonSafe(metricsRes) : null
	const metrics = extractData<DashboardMetrics>(metricsJson)
	const pendingCount = metrics?.pending_approvals_count ?? null

	const listRaw = listRes.ok ? await readJsonSafe(listRes) : null
	const parsed = extractPaginatedList<Record<string, unknown>>(listRaw)

	const items: ApprovalsTableRow[] = parsed.items.map((row) => {
		const user = row.user as DashboardUserBrief | undefined
		const desc =
			typeof row.description === 'string' ? row.description : ''
		const title = typeof row.title === 'string' ? row.title : ''
		const details = desc || title || '—'
		const statusRaw =
			typeof row.status === 'string' ? row.status : '—'
		const typ = typeof row.type === 'string' ? row.type : 'Request'
		const created =
			typeof row.created_at === 'string' ? row.created_at : null
		return {
			id: typeof row.id === 'number' ? row.id : 0,
			type: typ.replace(/_/g, ' '),
			userName: user?.name ?? '—',
			details,
			submittedLabel: formatWhen(created),
			status: statusRaw.replace(/_/g, ' '),
			statusBadgeClass: statusBadgeClass(statusRaw),
		}
	})

	return {
		userName,
		pendingCount,
		approvals: {
			items,
			pagination: parsed.pagination,
		},
	}
}
