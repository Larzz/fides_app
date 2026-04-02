import { cookies } from 'next/headers'
import { authPaths, pageDataPaths } from '@/lib/api-paths'
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

function todayLoggedCount(
	stats: Record<string, unknown> | null | undefined,
): number | null {
	if (!stats) {
		return null
	}
	const keys = [
		'activities_logged_today',
		'activities_today',
		'logs_today',
		'logged_today',
		'today_count',
		'todays_count',
		'count_today',
	]
	for (const k of keys) {
		const v = stats[k]
		if (typeof v === 'number' && !Number.isNaN(v)) {
			return v
		}
	}
	return null
}

export interface SystemLogsPageData {
	userName: string
	activitiesLoggedToday: number | null
	loadError: boolean
	logs: {
		items: DashboardActivityRow[]
		pagination: PaginationInfo
	}
	notifications: DashboardNotificationItem[]
	activities: DashboardActivityRow[]
}

export async function loadSystemLogsPageData(options: {
	page: number
	perPage?: number
}): Promise<SystemLogsPageData> {
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

	const empty: SystemLogsPageData = {
		userName: 'there',
		activitiesLoggedToday: null,
		loadError: false,
		logs: { items: [], pagination: emptyPagination },
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
		backendFetch(pageDataPaths.systemLogsStats, { method: 'GET', token }),
		backendFetch(`/activities?${listQuery.toString()}`, {
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
	const statsRecord = extractData<Record<string, unknown>>(statsJson)
	const activitiesLoggedToday = todayLoggedCount(statsRecord)

	const listRaw = listRes.ok ? await readJsonSafe(listRes) : null
	const parsed = extractPaginatedList<Record<string, unknown>>(listRaw)
	const loadError = !listRes.ok

	const logItems: DashboardActivityRow[] = loadError
		? []
		: parsed.items.map((row) => {
				const u = row.user as DashboardUserBrief | undefined
				const action =
					(typeof row.action === 'string' ? row.action : '') ||
					(typeof row.description === 'string'
						? row.description
						: '') ||
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
		activitiesLoggedToday,
		loadError,
		logs: {
			items: logItems,
			pagination: loadError ? emptyPagination : parsed.pagination,
		},
		notifications,
		activities,
	}
}
