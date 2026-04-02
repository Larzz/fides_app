/**
 * Paths relative to `API_BASE_URL` (Laravel `routes/api.php`).
 */

export const authPaths = {
	login: '/login',
	logout: '/logout',
	me: '/me',
} as const

export const pageDataPaths = {
	dashboard: '/dashboard',
	approvals: '/approvals?per_page=1',
	clientsMetrics: '/clients/metrics',
	employeesMetrics: '/employees/metrics',
	systemLogsStats: '/system-logs/stats',
	content: '/content?per_page=1',
	workToolsStats: '/work-tools/stats',
	accessStats: '/accesses/stats',
	tools: '/tools?per_page=1',
} as const
