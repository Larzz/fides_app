import { cookies } from 'next/headers'
import { backendFetch, readJsonSafe } from '@/lib/api-client'
import { authPaths } from '@/lib/api-paths'
import {
	extractData,
	extractPaginatedList,
	type PaginationInfo,
} from '@/lib/api-parse'

export interface EmployeesMetrics {
	total_employees: number
	active_employees: number
	on_leave_count: number
}

interface CompanyLike {
	id?: number
	name?: string
}

interface EmployeeLike {
	id?: number
	name?: string
	email?: string
	job_title?: string
	status?: string
	last_active_at?: string | null
	companies?: CompanyLike[]
}

export interface EmployeesRow {
	id: number
	name: string
	roleLabel: string
	assignedClientsLabel: string
	status: string
	statusBadgeClass: string
	lastActiveLabel: string
}

export interface EmployeesPageData {
	userName: string
	metrics: EmployeesMetrics | null
	employees: {
		items: EmployeesRow[]
		pagination: PaginationInfo
	}
}

function pad2(n: number): string {
	return n < 10 ? `0${n}` : String(n)
}

function formatLastActive(iso: string | null | undefined): string {
	if (!iso) return '—'
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return '—'

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const day = d.getDate()
	const month = months[d.getMonth()] ?? '—'
	const year = d.getFullYear()
	const hour = pad2(d.getHours())
	const minute = pad2(d.getMinutes())

	return `${day} ${month} ${year} - ${hour}:${minute}`
}

function statusBadge(statusRaw: string | undefined | null): {
	label: string
	className: string
} {
	const status = String(statusRaw ?? '').toLowerCase()
	if (status === 'active') {
		return { label: 'Active', className: 'bg-green-100 text-green-800' }
	}
	if (status === 'on_leave') {
		return { label: 'On Leave', className: 'bg-yellow-100 text-yellow-800' }
	}
	if (status === 'inactive') {
		return { label: 'Inactive', className: 'bg-red-100 text-red-800' }
	}
	if (status) {
		return { label: status.replace(/_/g, ' '), className: 'bg-gray-100 text-gray-700' }
	}
	return { label: '—', className: 'bg-gray-100 text-gray-700' }
}

function assignedClientsLabel(companies: CompanyLike[] | undefined): string {
	const list = Array.isArray(companies) ? companies : []
	const names = list.map((c) => (typeof c.name === 'string' ? c.name : '')).filter(Boolean)

	if (names.length === 0) return '—'
	if (names.length === 1) return names[0]
	return `${names[0]} +${names.length - 1}`
}

export async function loadEmployeesPageData(
	perPage: number = 10,
): Promise<EmployeesPageData> {
	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value
	if (!token) {
		return {
			userName: 'there',
			metrics: null,
			employees: {
				items: [],
				pagination: {
					total: 0,
					currentPage: 1,
					lastPage: 1,
					perPage,
				},
			},
		}
	}

	const [meRes, metricsRes, listRes] = await Promise.all([
		backendFetch(authPaths.me, { method: 'GET', token }),
		backendFetch('/employees/metrics', { method: 'GET', token }),
		backendFetch(`/employees?per_page=${perPage}`, { method: 'GET', token }),
	])

	const meJson = meRes.ok ? await readJsonSafe(meRes) : null
	const meData = extractData<{ name?: string }>(meJson)
	const userName = meData?.name?.trim() || 'there'

	const metricsJson = metricsRes.ok ? await readJsonSafe(metricsRes) : null
	const metrics = extractData<EmployeesMetrics>(metricsJson)

	const employeesRaw = listRes.ok ? await readJsonSafe(listRes) : null
	const parsed = extractPaginatedList<EmployeeLike>(employeesRaw)

	const items: EmployeesRow[] = parsed.items.map((row) => {
		const st = statusBadge(row.status)
		return {
			id: typeof row.id === 'number' ? row.id : 0,
			name: typeof row.name === 'string' ? row.name : '—',
			roleLabel:
				typeof row.job_title === 'string' && row.job_title
					? row.job_title
					: '—',
			assignedClientsLabel: assignedClientsLabel(row.companies),
			status: st.label,
			statusBadgeClass: st.className,
			lastActiveLabel: formatLastActive(row.last_active_at),
		}
	})

	return {
		userName,
		metrics: metrics ?? null,
		employees: {
			items,
			pagination: parsed.pagination,
		},
	}
}

