import { PageLayout } from '@/components/page-layout'

export default function EmployeesPage() {
	return (
		<PageLayout title="Welcome, Sarah 👋">
			{/* Stats Cards */}
			<div className="grid grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">8</span>
						<div>
							<div className="text-sm font-semibold text-gray-700">Active Employees</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">1</span>
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
							{[
								{ name: 'Ahmed R.', role: 'SEO Specialist', client: 'ALPHA CORP', status: 'Active', date: '23 Jan 2026 - 08:55' },
								{ name: 'Lina M.', role: 'Web Designer', client: 'NOVA LLC', status: 'Active', date: '22 Jan 2026 - 15:10' },
								{ name: 'Omar K.', role: 'Content Writer', client: 'VERTEX MEDIA', status: 'Active', date: '23 Jan 2026 - 09:14' },
								{ name: 'Mark T.', role: 'Developer', client: 'NOVA LLC', status: 'Active', date: '20 Jan 2026 - 16:18' },
								{ name: 'Nina P.', role: 'Marketing Manager', client: 'VERTEX MEDIA', status: 'Active', date: '21 Jan 2026 - 11:30' },
								{ name: 'Sara L.', role: 'Account Manager', client: 'ALPHA CORP', status: 'On Leave', date: '19 Jan 2026 - 14:20', statusColor: 'yellow' },
								{ name: 'John D.', role: 'Project Manager', client: 'ATLAS CONSULTING', status: 'Inactive', date: '15 Jan 2026 - 10:45', statusColor: 'red' },
								{ name: 'Maya S.', role: 'Graphic Designer', client: 'ZENITH FZCO', status: 'Inactive', date: '12 Jan 2026 - 09:15', statusColor: 'red' },
								{ name: 'Daniel F.', role: 'Developer', client: 'NOVA LLC', status: 'Active', date: '22 Jan 2026 - 13:25' },
								{ name: 'Alex K.', role: 'SEO Specialist', client: 'ALPHA CORP', status: 'Active', date: '21 Jan 2026 - 16:40' },
							].map((employee, idx) => (
								<tr key={idx} className="hover:bg-gray-50">
									<td className="px-4 py-3 text-sm text-gray-900">{employee.name}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{employee.role}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{employee.client}</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												employee.statusColor === 'yellow'
													? 'bg-yellow-100 text-yellow-800'
													: employee.statusColor === 'red'
														? 'bg-red-100 text-red-800'
														: 'bg-green-100 text-green-800'
											}`}
										>
											{employee.status}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-gray-500">{employee.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex justify-between items-center mt-6">
					<span className="text-sm text-gray-600">Showing 1 to 10 of 23 records</span>
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

