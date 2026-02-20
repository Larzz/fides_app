import { PageLayout } from '@/components/page-layout'

export default function ClientsPage() {
	return (
		<PageLayout title="Welcome, Sarah 👋">
			{/* Stats Cards */}
			<div className="grid grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">12</span>
						<div>
							<div className="text-sm font-semibold text-gray-700">Active Clients</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">2</span>
						<div>
							<div className="text-sm font-semibold text-gray-700">Contracts Expiring</div>
						</div>
					</div>
				</div>
			</div>

			{/* Clients Table */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<div className="flex gap-3">
						<button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
							ADD CLIENT
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
							Assigned Employees ▼
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
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Primary Contact</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned Employees</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contract Status</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status ↓</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{ name: 'Alpha Corp', contact: 'John D.', employees: 'Ahmed R., Lina M. (+1 more)', contract: 'Expiring (14 days)', contractColor: 'yellow', status: 'Active' },
								{ name: 'Nova LLC', contact: 'Daniel F.', employees: 'Ahmed R., Mark T. (+1 more)', contract: 'Active', contractColor: 'green', status: 'Active' },
								{ name: 'Vertex Media', contact: 'Maya S.', employees: 'Omar K., Nina P. (+1 more)', contract: 'Expiring (28 days)', contractColor: 'yellow', status: 'Active' },
								{ name: 'Atlas Consulting', contact: 'John D.', employees: 'John D., Maya S. (+1 more)', contract: 'Expired', contractColor: 'red', status: 'Inactive', statusColor: 'red' },
								{ name: 'Zenith FZCO', contact: 'Alex K.', employees: 'Maya S., Omar K.', contract: 'Active', contractColor: 'green', status: 'Active' },
								{ name: 'Tech Solutions', contact: 'Sarah M.', employees: 'Mark T., Daniel F.', contract: 'Active', contractColor: 'green', status: 'Active' },
								{ name: 'Digital Agency', contact: 'Mike R.', employees: 'Lina M., Nina P.', contract: 'Active', contractColor: 'green', status: 'Active' },
								{ name: 'Global Media', contact: 'Lisa T.', employees: 'Ahmed R., Omar K.', contract: 'Active', contractColor: 'green', status: 'Active' },
								{ name: 'Creative Studio', contact: 'Tom H.', employees: 'Mark T., Alex K.', contract: 'Active', contractColor: 'green', status: 'Active' },
								{ name: 'Innovation Labs', contact: 'Emma W.', employees: 'Daniel F., Lina M.', contract: 'Active', contractColor: 'green', status: 'Active' },
							].map((client, idx) => (
								<tr key={idx} className="hover:bg-gray-50">
									<td className="px-4 py-3 text-sm text-gray-900">{client.name}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{client.contact}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{client.employees}</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												client.contractColor === 'yellow'
													? 'bg-yellow-100 text-yellow-800'
													: client.contractColor === 'red'
														? 'bg-red-100 text-red-800'
														: 'bg-green-100 text-green-800'
											}`}
										>
											{client.contract}
										</span>
									</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												client.statusColor === 'red' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
											}`}
										>
											{client.status}
										</span>
									</td>
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

