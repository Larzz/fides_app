import { cookies } from 'next/headers'
import { authPaths } from '@/lib/api-paths'
import { backendFetch, readJsonSafe } from '@/lib/api-client'
import {
	extractData,
	extractPaginatedList,
	type PaginationInfo,
} from '@/lib/api-parse'
import type { DashboardUserBrief } from '@/lib/dashboard-service'

/**
 * Work tools are used for policies/holidays when stored with this category
 * (matches `WorkToolFilter` category equality). Override via env if needed.
 */
const HOLIDAY_CATEGORY =
	process.env.WORK_POLICIES_HOLIDAY_CATEGORY?.trim() ||
	'Public Holiday'

export interface PublicHolidayRow {
	id: number
	name: string
	dateLabel: string
}

export interface WorkPoliciesPageData {
	userName: string
	holidayCategory: string
	holidays: {
		items: PublicHolidayRow[]
		pagination: PaginationInfo
	}
	publicHolidaySummary: string
	inactiveSummary: string
}

function formatPolicyDate(value: string | null | undefined): string {
	if (!value) {
		return '—'
	}
	const d = new Date(`${value}T12:00:00`)
	if (Number.isNaN(d.getTime())) {
		return value
	}
	return d.toLocaleDateString('en-AE', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

export async function loadWorkPoliciesPageData(): Promise<WorkPoliciesPageData> {
	const emptyPagination: PaginationInfo = {
		total: 0,
		currentPage: 1,
		lastPage: 1,
		perPage: 100,
	}

	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value

	const defaults: WorkPoliciesPageData = {
		userName: 'there',
		holidayCategory: HOLIDAY_CATEGORY,
		holidays: { items: [], pagination: emptyPagination },
		publicHolidaySummary: '0 public holidays',
		inactiveSummary: 'No inactive policies',
	}

	if (!token) {
		return defaults
	}

	const holidayQuery = new URLSearchParams({
		category: HOLIDAY_CATEGORY,
		per_page: '100',
		sort_by: 'renewal_date',
		sort_order: 'asc',
	})

	const inactiveQuery = new URLSearchParams({
		status: 'inactive',
		per_page: '5',
		sort_by: 'name',
		sort_order: 'asc',
	})

	const [meRes, holidaysRes, inactiveRes] = await Promise.all([
		backendFetch(authPaths.me, { method: 'GET', token }),
		backendFetch(`/work-tools?${holidayQuery.toString()}`, {
			method: 'GET',
			token,
		}),
		backendFetch(`/work-tools?${inactiveQuery.toString()}`, {
			method: 'GET',
			token,
		}),
	])

	const meJson = meRes.ok ? await readJsonSafe(meRes) : null
	const me = extractData<DashboardUserBrief>(meJson)
	const userName = me?.name?.trim() || 'there'

	const holidaysRaw = holidaysRes.ok ? await readJsonSafe(holidaysRes) : null
	const holidaysParsed =
		extractPaginatedList<Record<string, unknown>>(holidaysRaw)

	const items: PublicHolidayRow[] = holidaysParsed.items.map((row) => ({
		id: typeof row.id === 'number' ? row.id : 0,
		name: typeof row.name === 'string' ? row.name : '—',
		dateLabel: formatPolicyDate(
			typeof row.renewal_date === 'string' ? row.renewal_date : null,
		),
	}))

	const n = holidaysParsed.pagination.total
	const publicHolidaySummary =
		n === 1 ? '1 public holiday' : `${n} public holidays`

	const inactiveRaw = inactiveRes.ok ? await readJsonSafe(inactiveRes) : null
	const inactiveParsed =
		extractPaginatedList<Record<string, unknown>>(inactiveRaw)
	const firstInactive = inactiveParsed.items[0]
	const firstName =
		firstInactive && typeof firstInactive.name === 'string'
			? firstInactive.name
			: null
	const inactiveSummary =
		firstName != null
			? `${firstName} (Inactive)`
			: inactiveParsed.pagination.total > 0
				? `${inactiveParsed.pagination.total} inactive`
				: 'No inactive policies'

	return {
		userName,
		holidayCategory: HOLIDAY_CATEGORY,
		holidays: {
			items,
			pagination: holidaysParsed.pagination,
		},
		publicHolidaySummary,
		inactiveSummary,
	}
}
