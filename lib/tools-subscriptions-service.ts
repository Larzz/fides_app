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

interface WorkToolsStatsPayload {
	active_subscriptions?: number
	monthly_cost_aed?: string
	annual_cost_aed?: string
}

export interface ToolSubscriptionRow {
	id: number
	index: number
	name: string
	category: string
	billing: string
	costDisplay: string
	currency: string
	renewalLabel: string
	status: string
	statusClassName: string
}

export interface ToolsSubscriptionsPageData {
	userName: string
	activeSubscriptions: number | null
	monthlyCostLabel: string
	annualCostLabel: string
	tools: {
		items: ToolSubscriptionRow[]
		pagination: PaginationInfo
	}
	notifications: DashboardNotificationItem[]
	activities: DashboardActivityRow[]
}

function formatAedAmount(raw: string | number | null | undefined): string {
	if (raw === null || raw === undefined || raw === '') {
		return '—'
	}
	const n =
		typeof raw === 'string' ? Number.parseFloat(raw) : Number(raw)
	if (Number.isNaN(n)) {
		return String(raw)
	}
	return n.toLocaleString('en-AE', { maximumFractionDigits: 0 })
}

function formatRenewal(iso: string | null | undefined): string {
	if (!iso) {
		return '—'
	}
	const d = new Date(`${iso}T12:00:00`)
	if (Number.isNaN(d.getTime())) {
		return iso
	}
	return d.toLocaleDateString('en-AE', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

function billingLabel(raw: string | null | undefined): string {
	if (!raw) {
		return '—'
	}
	return raw.replace(/_/g, ' ')
}

function formatCostCell(costStr: string, billingType: string): string {
	const n = Number.parseFloat(costStr)
	if (Number.isNaN(n)) {
		return costStr || '—'
	}
	if (billingType === 'free' || n === 0) {
		return '0'
	}
	return n.toLocaleString('en-AE', { maximumFractionDigits: 2 })
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

export async function loadToolsSubscriptionsPageData(options: {
	page: number
	perPage?: number
}): Promise<ToolsSubscriptionsPageData> {
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

	const empty: ToolsSubscriptionsPageData = {
		userName: 'there',
		activeSubscriptions: null,
		monthlyCostLabel: '—',
		annualCostLabel: '—',
		tools: { items: [], pagination: emptyPagination },
		notifications: [],
		activities: [],
	}

	if (!token) {
		return empty
	}

	const toolsQuery = new URLSearchParams({
		per_page: String(perPage),
		page: String(page),
		sort_by: 'name',
		sort_order: 'asc',
	})

	const [
		meRes,
		statsRes,
		toolsRes,
		notifRes,
		actRes,
	] = await Promise.all([
		backendFetch(authPaths.me, { method: 'GET', token }),
		backendFetch('/work-tools/stats', { method: 'GET', token }),
		backendFetch(`/work-tools?${toolsQuery.toString()}`, {
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
	const stats = extractData<WorkToolsStatsPayload>(statsJson)
	const activeSubscriptions =
		typeof stats?.active_subscriptions === 'number'
			? stats.active_subscriptions
			: null
	const monthlyCostLabel = formatAedAmount(stats?.monthly_cost_aed)
	const annualCostLabel = formatAedAmount(stats?.annual_cost_aed)

	const toolsRaw = toolsRes.ok ? await readJsonSafe(toolsRes) : null
	const parsed = extractPaginatedList<Record<string, unknown>>(toolsRaw)
	const offset = (parsed.pagination.currentPage - 1) * parsed.pagination.perPage

	const items: ToolSubscriptionRow[] = parsed.items.map((row, idx) => {
		const billing =
			typeof row.billing_type === 'string' ? row.billing_type : ''
		const costStr = typeof row.cost === 'string' ? row.cost : '0'
		const statusRaw =
			typeof row.status === 'string' ? row.status : '—'
		return {
			id: typeof row.id === 'number' ? row.id : 0,
			index: offset + idx + 1,
			name: typeof row.name === 'string' ? row.name : '—',
			category:
				typeof row.category === 'string' ? row.category : '—',
			billing: billingLabel(billing),
			costDisplay: formatCostCell(costStr, billing),
			currency:
				typeof row.currency === 'string' ? row.currency : '—',
			renewalLabel: formatRenewal(
				typeof row.renewal_date === 'string'
					? row.renewal_date
					: null,
			),
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
		activeSubscriptions,
		monthlyCostLabel,
		annualCostLabel,
		tools: {
			items,
			pagination: parsed.pagination,
		},
		notifications,
		activities,
	}
}
