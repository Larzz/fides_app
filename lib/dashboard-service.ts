import { cookies } from 'next/headers'
import { authPaths } from '@/lib/api-paths'
import { backendFetch, readJsonSafe } from '@/lib/api-client'
import { extractData, extractPaginatedList } from '@/lib/api-parse'

export interface DashboardMetrics {
	pending_approvals_count: number
	active_users_count: number
	uploads_last_7_days: number
	logins_today: number
}

export interface DashboardUserBrief {
	id?: number
	name?: string
	email?: string
	role?: string
	role_details?: { name?: string }
}

export interface DashboardApprovalRow {
	id: number
	type: string
	userName: string
	details: string
	submittedLabel: string
	status: string
}

export interface DashboardFileRow {
	id: number
	title: string
	uploaderName: string
	sharedLabel: string
	notifyStakeholders: boolean
}

export interface DashboardUserRow {
	id: number
	name: string
	roleLabel: string
}

export interface DashboardNotificationItem {
	id: number
	title: string
	message: string
	createdAt: string
	relativeLabel: string
}

export interface DashboardActivityRow {
	id: number
	action: string
	userLabel: string
	whenLabel: string
}

export interface DashboardPagePayload {
	userName: string
	metrics: DashboardMetrics | null
	approvals: {
		items: DashboardApprovalRow[]
		pagination: import('./api-parse').PaginationInfo
	}
	files: { items: DashboardFileRow[] }
	users: { items: DashboardUserRow[] }
	notifications: { items: DashboardNotificationItem[] }
	activities: { items: DashboardActivityRow[] }
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

function statusBadgeClass(status: string): string {
	const s = status.toLowerCase()
	if (s.includes('pending') || s.includes('required')) {
		return 'bg-blue-100 text-blue-800'
	}
	if (s.includes('reject') || s.includes('action')) {
		return 'bg-red-100 text-red-800'
	}
	return 'bg-green-100 text-green-800'
}

export { statusBadgeClass }

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

function roleLabel(u: DashboardUserBrief): string {
	const fromDetails = u.role_details?.name
	const fromRole =
		typeof u.role === 'string' && u.role.length > 0 ? u.role : null
	return fromDetails ?? fromRole ?? '—'
}

export async function loadDashboardPageData(): Promise<DashboardPagePayload> {
	const empty: DashboardPagePayload = {
		userName: 'there',
		metrics: null,
		approvals: {
			items: [],
			pagination: {
				total: 0,
				currentPage: 1,
				lastPage: 1,
				perPage: 10,
			},
		},
		files: { items: [] },
		users: { items: [] },
		notifications: { items: [] },
		activities: { items: [] },
	}

	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value
	if (!token) {
		return empty
	}

	const paths = {
		me: authPaths.me,
		metrics: '/dashboard',
		approvals: '/approvals?per_page=10',
		files:
			'/files?tab=all&per_page=5&sort_by=updated_at&sort_dir=desc',
		users: '/users?per_page=5',
		notifications: '/notifications?per_page=5',
		activities: '/activities?per_page=8',
	}

	const [
		meRes,
		metricsRes,
		approvalsRes,
		filesRes,
		usersRes,
		notificationsRes,
		activitiesRes,
	] = await Promise.all([
		backendFetch(paths.me, { method: 'GET', token }),
		backendFetch(paths.metrics, { method: 'GET', token }),
		backendFetch(paths.approvals, { method: 'GET', token }),
		backendFetch(paths.files, { method: 'GET', token }),
		backendFetch(paths.users, { method: 'GET', token }),
		backendFetch(paths.notifications, { method: 'GET', token }),
		backendFetch(paths.activities, { method: 'GET', token }),
	])

	const meJson = meRes.ok ? await readJsonSafe(meRes) : null
	const me = extractData<DashboardUserBrief>(meJson)
	const userName = me?.name?.trim() || 'there'

	const metricsJson = metricsRes.ok ? await readJsonSafe(metricsRes) : null
	const metrics = extractData<DashboardMetrics>(metricsJson)

	const approvalsRaw = approvalsRes.ok
		? await readJsonSafe(approvalsRes)
		: null
	const approvalsParsed = extractPaginatedList<Record<string, unknown>>(
		approvalsRaw,
	)
	const approvalItems: DashboardApprovalRow[] = approvalsParsed.items.map(
		(row) => {
			const user = row.user as DashboardUserBrief | undefined
			const desc =
				typeof row.description === 'string' ? row.description : ''
			const title = typeof row.title === 'string' ? row.title : ''
			const details = desc || title || '—'
			const status =
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
				status,
			}
		},
	)

	const filesRaw = filesRes.ok ? await readJsonSafe(filesRes) : null
	const filesParsed = extractPaginatedList<Record<string, unknown>>(filesRaw)
	const fileItems: DashboardFileRow[] = filesParsed.items.map((row) => {
		const uploader = row.uploader as DashboardUserBrief | undefined
		return {
			id: typeof row.id === 'number' ? row.id : 0,
			title: typeof row.title === 'string' ? row.title : '—',
			uploaderName: uploader?.name ?? '—',
			sharedLabel: sharedLabel(
				row as { shares?: Array<{ share_all_employees?: boolean }> },
			),
			notifyStakeholders: Boolean(row.notify_stakeholders),
		}
	})

	const usersRaw = usersRes.ok ? await readJsonSafe(usersRes) : null
	const usersParsed = extractPaginatedList<Record<string, unknown>>(usersRaw)
	const userItems: DashboardUserRow[] = usersParsed.items.map((row) => {
		const u = row as DashboardUserBrief & { id?: number }
		return {
			id: typeof u.id === 'number' ? u.id : 0,
			name: typeof u.name === 'string' ? u.name : '—',
			roleLabel: roleLabel(u),
		}
	})

	const notifRaw = notificationsRes.ok
		? await readJsonSafe(notificationsRes)
		: null
	const notifParsed =
		extractPaginatedList<Record<string, unknown>>(notifRaw)
	const notificationItems: DashboardNotificationItem[] =
		notifParsed.items.map((row) => ({
			id: typeof row.id === 'number' ? row.id : 0,
			title: typeof row.title === 'string' ? row.title : 'Notification',
			message: typeof row.message === 'string' ? row.message : '',
			createdAt:
				typeof row.created_at === 'string' ? row.created_at : '',
			relativeLabel: formatRelative(
				typeof row.created_at === 'string' ? row.created_at : null,
			),
		}))

	const actRaw = activitiesRes.ok ? await readJsonSafe(activitiesRes) : null
	const actParsed = extractPaginatedList<Record<string, unknown>>(actRaw)
	const activityItems: DashboardActivityRow[] = actParsed.items.map(
		(row) => {
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
		},
	)

	return {
		userName,
		metrics,
		approvals: {
			items: approvalItems,
			pagination: approvalsParsed.pagination,
		},
		files: { items: fileItems },
		users: { items: userItems },
		notifications: { items: notificationItems },
		activities: { items: activityItems },
	}
}
