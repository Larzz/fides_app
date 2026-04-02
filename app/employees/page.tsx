import { PageLayout } from '@/components/page-layout'
import { loadEmployeesPageData } from '@/lib/employees-service'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
	const data = await loadEmployeesPageData(10)
	const title = `Welcome, ${data.userName} 👋`

	return (
		<PageLayout title={title}>
			{/* Stats Cards */}
			<div className="grid grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">
							{data.metrics?.active_employees ?? '—'}
						</span>
						<div>
							<div className="text-sm font-semibold text-gray-700">Active Employees</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">
							{data.metrics?.on_leave_count ?? '—'}
						</span>
						<div>
							<div className="text-sm font-semibold text-gray-700">On Leave</div>
						</div>
					</div>
				</div>
			</div>

			{/* Employees Table */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<div className="flex gap-3">
						<button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
							ADD EMPLOYEE
						</button>
						<button className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50">
							EXPORT
						</button>
					</div>
					<div className="flex gap-3">
						<div className="relative">
							<input
								type="text"
								placeholder="Search name, email..."
								className="px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
							/>
							<button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
								<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						</div>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50">
							User Type ▼
						</button>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50">
							Role ▼
						</button>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50">
							Assigned Client ▼
						</button>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50">
							Status ▼
						</button>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned Clients</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Active</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{data.employees.items.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-4 py-8 text-sm text-center text-gray-500">
										No employees found.
									</td>
								</tr>
							) : (
								data.employees.items.map((employee) => (
									<tr key={employee.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-900">{employee.name}</td>
										<td className="px-4 py-3 text-sm text-gray-500">{employee.roleLabel}</td>
										<td className="px-4 py-3 text-sm text-gray-500">
											{employee.assignedClientsLabel}
										</td>
										<td className="px-4 py-3 text-sm">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${employee.statusBadgeClass}`}
											>
												{employee.status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">
											{employee.lastActiveLabel}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex justify-between items-center mt-6">
					{(() => {
						const ap = data.employees.pagination
						const from =
							ap.total === 0 ? 0 : (ap.currentPage - 1) * ap.perPage + 1
						const to =
							ap.total === 0 ? 0 : Math.min(ap.currentPage * ap.perPage, ap.total)

						return (
							<span className="text-sm text-gray-600">
								Showing {from} to {to} of {ap.total} records
							</span>
						)
					})()}
					<div className="flex gap-2">
						<button className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">
							1
						</button>
						<button className="w-8 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50">
							2
						</button>
						<button className="w-8 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50">
							3
						</button>
						<button className="w-8 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50">
							›
						</button>
						<button className="w-8 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50">
							»
						</button>
					</div>
				</div>
			</div>
		</PageLayout>
	)
}

