import { cookies } from 'next/headers'
import { authPaths } from '@/lib/api-paths'
import { backendFetch, readJsonSafe } from '@/lib/api-client'
import {
	extractData,
	extractPaginatedList,
	type PaginationInfo,
} from '@/lib/api-parse'
import type {
	DashboardActivityRow,
	DashboardNotificationItem,
	DashboardUserBrief,
} from '@/lib/dashboard-service'

interface AccessStatsPayload {
	active_access_count?: number
}

interface CompanyBrief {
	id?: number
	name?: string
	logo?: string | null
}

interface UserBrief {
	name?: string
}

export interface AccessManagementRow {
	id: number
	index: number
	accessName: string
	companyName: string
	companyLogo: string | null
	platform: string
	employeeBadges: string[]
	status: string
	statusClassName: string
}

export interface AccessManagementPageData {
	userName: string
	activeAccessCount: number | null
	loadError: boolean
	accesses: {
		items: AccessManagementRow[]
		pagination: PaginationInfo
	}
	notifications: DashboardNotificationItem[]
	activities: DashboardActivityRow[]
}

function employeeBadge(fullName: string): string {
	const parts = fullName.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) {
		return ''
	}
	if (parts.length === 1) {
		return parts[0].toUpperCase()
	}
	const last = parts[parts.length - 1]
	if (!last || !last[0]) {
		return parts[0].toUpperCase()
	}
	return `${parts[0].toUpperCase()} ${last[0].toUpperCase()}.`
}

function statusClassName(status: string): string {
	const s = status.toLowerCase()
	if (s === 'active') {
		return 'text-green-700 font-medium'
	}
	if (s === 'inactive') {
		return 'text-red-600 font-medium'
	}
	return 'text-gray-800 font-medium'
}

function formatRelative(iso: string | null | undefined): string {
	if (!iso) {
		return ''
	}
	const d = new Date(iso)
	const diff = Date.now() - d.getTime()
	if (diff < 0) {
		return 'Just now'
	}
	const mins = Math.floor(diff / 60_000)
	if (mins < 1) {
		return 'Just now'
	}
	if (mins < 60) {
		return `${mins} min ago`
	}
	const hours = Math.floor(mins / 60)
	if (hours < 24) {
		return hours === 1 ? '1 hr ago' : `${hours} hr ago`
	}
	const days = Math.floor(hours / 24)
	if (days < 7) {
		return days === 1 ? 'Yesterday' : `${days} days ago`
	}
	return formatWhen(iso)
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

export async function loadAccessManagementPageData(options: {
	page: number
	perPage?: number
}): Promise<AccessManagementPageData> {
	const perPage = options.perPage ?? 10
	const page = Math.max(1, options.page)
	const emptyPagination: PaginationInfo = {
		total: 0,
		currentPage: page,
		lastPage: 1,
		perPage,
	}

	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value

	const empty: AccessManagementPageData = {
		userName: 'there',
		activeAccessCount: null,
		loadError: false,
		accesses: { items: [], pagination: emptyPagination },
		notifications: [],
		activities: [],
	}

	if (!token) {
		return empty
	}

	const listQuery = new URLSearchParams({
		per_page: String(perPage),
		page: String(page),
	})

	const [meRes, statsRes, listRes, notifRes, actRes] = await Promise.all([
		backendFetch(authPaths.me, { method: 'GET', token }),
		backendFetch('/accesses/stats', { method: 'GET', token }),
		backendFetch(`/accesses?${listQuery.toString()}`, {
			method: 'GET',
			token,
		}),
		backendFetch('/notifications?per_page=5', { method: 'GET', token }),
		backendFetch('/activities?per_page=8', { method: 'GET', token }),
	])

	const meJson = meRes.ok ? await readJsonSafe(meRes) : null
	const me = extractData<DashboardUserBrief>(meJson)
	const userName = me?.name?.trim() || 'there'

	const statsJson = statsRes.ok ? await readJsonSafe(statsRes) : null
	const stats = extractData<AccessStatsPayload>(statsJson)
	const activeAccessCount =
		typeof stats?.active_access_count === 'number'
			? stats.active_access_count
			: null

	const listRaw = listRes.ok ? await readJsonSafe(listRes) : null
	const parsed = extractPaginatedList<Record<string, unknown>>(listRaw)
	const loadError = !listRes.ok
	const offset =
		(parsed.pagination.currentPage - 1) * parsed.pagination.perPage

	const items: AccessManagementRow[] = parsed.items.map((row, idx) => {
		const company = row.company as CompanyBrief | undefined
		const usersRaw = row.users
		const users = Array.isArray(usersRaw)
			? (usersRaw as UserBrief[])
			: []
		const badges = users
			.map((u) =>
				typeof u.name === 'string' ? employeeBadge(u.name) : '',
			)
			.filter(Boolean)

		const name =
			typeof row.name === 'string' ? row.name : '—'
		const platform =
			typeof row.platform === 'string' ? row.platform : '—'
		const statusRaw =
			typeof row.status === 'string' ? row.status : '—'
		const logo =
			company?.logo &&
			typeof company.logo === 'string' &&
			company.logo.length > 0
				? company.logo
				: null

		return {
			id: typeof row.id === 'number' ? row.id : 0,
			index: offset + idx + 1,
			accessName: name,
			companyName:
				typeof company?.name === 'string' ? company.name : '—',
			companyLogo: logo,
			platform,
			employeeBadges: badges,
			status: statusRaw.replace(/_/g, ' '),
			statusClassName: statusClassName(statusRaw),
		}
	})

	const notifRaw = notifRes.ok ? await readJsonSafe(notifRes) : null
	const notifParsed = extractPaginatedList<Record<string, unknown>>(notifRaw)
	const notifications: DashboardNotificationItem[] = notifParsed.items.map(
		(row) => ({
			id: typeof row.id === 'number' ? row.id : 0,
			title: typeof row.title === 'string' ? row.title : 'Notification',
			message: typeof row.message === 'string' ? row.message : '',
			createdAt:
				typeof row.created_at === 'string' ? row.created_at : '',
			relativeLabel: formatRelative(
				typeof row.created_at === 'string' ? row.created_at : null,
			),
		}),
	)

	const actRaw = actRes.ok ? await readJsonSafe(actRes) : null
	const actParsed = extractPaginatedList<Record<string, unknown>>(actRaw)
	const activities: DashboardActivityRow[] = actParsed.items.map((row) => {
		const u = row.user as DashboardUserBrief | undefined
		const action =
			(typeof row.action === 'string' ? row.action : '') ||
			(typeof row.description === 'string' ? row.description : '') ||
			'—'
		const created =
			typeof row.created_at === 'string' ? row.created_at : null
		return {
			id: typeof row.id === 'number' ? row.id : 0,
			action: action.replace(/_/g, ' '),
			userLabel: u?.name ?? 'System',
			whenLabel: formatWhen(created),
		}
	})

	return {
		userName,
		activeAccessCount,
		loadError,
		accesses: {
			items,
			pagination: parsed.pagination,
		},
		notifications,
		activities,
	}
}
