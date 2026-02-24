import { PageLayout } from '@/components/page-layout'

export default function ApprovalsPage() {
	return (
		<PageLayout title="Welcome, Sarah 👋">
			{/* Stats Card */}
			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex items-baseline gap-2">
					<span className="text-4xl font-bold text-gray-800">4</span>
					<div>
						<div className="text-sm font-semibold text-gray-700">Pending Requests</div>
					</div>
				</div>
			</div>

			{/* Requests Table */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<div className="flex gap-3">
						<button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
							EXPORT
						</button>
					</div>
					<div className="flex gap-3">
						<div className="relative">
							<input
								type="text"
								placeholder="Search..."
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
							Status ▼
						</button>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50">
							Request Type ▼
						</button>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Request Type ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submitted On ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status ↓</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{ type: 'Leave Request', user: 'Ahmed R.', details: 'Annual Leave - 5 days', date: '22 Jan 2026 - 15:10', status: 'Pending', statusColor: 'blue' },
								{ type: 'Ticket Allowance', user: 'Lina M.', details: 'AED 750 - Invoice - Feb 2026', date: '21 Jan 2026 - 10:05', status: 'Reviewed', statusColor: 'green' },
								{ type: 'WFH Request', user: 'Omar K.', details: 'Work from home - 2 days', date: '20 Jan 2026 - 14:20', status: 'Pending', statusColor: 'blue' },
								{ type: 'File Submission', user: 'Mark T.', details: 'Contract_Renewal.pdf', date: '21 Jan 2026 - 09:42', status: 'Reimbursed', statusColor: 'green' },
								{ type: 'Tool Request', user: 'Nina P.', details: 'Software license - Adobe Creative Suite', date: '19 Jan 2026 - 11:30', status: 'Rejected', statusColor: 'red' },
								{ type: 'Leave Request', user: 'Sara L.', details: 'Sick Leave - 3 days', date: '18 Jan 2026 - 09:15', status: 'Pending', statusColor: 'blue' },
								{ type: 'Ticket Allowance', user: 'Daniel F.', details: 'AED 500 - Invoice - Jan 2026', date: '17 Jan 2026 - 16:40', status: 'Reviewed', statusColor: 'green' },
								{ type: 'File Submission', user: 'Alex K.', details: 'Marketing_Deck.pdf', date: '16 Jan 2026 - 13:25', status: 'Action Required', statusColor: 'red' },
								{ type: 'WFH Request', user: 'Maya S.', details: 'Work from home - 1 day', date: '15 Jan 2026 - 10:45', status: 'Pending', statusColor: 'blue' },
								{ type: 'Tool Request', user: 'Tom H.', details: 'Hardware - External Monitor', date: '14 Jan 2026 - 08:30', status: 'Reviewed', statusColor: 'green' },
							].map((request, idx) => (
								<tr key={idx} className="hover:bg-gray-50">
									<td className="px-4 py-3 text-sm text-gray-900">{request.type}</td>
									<td className="px-4 py-3 text-sm text-gray-700">
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 rounded-full bg-gray-300"></div>
											{request.user}
										</div>
									</td>
									<td className="px-4 py-3 text-sm text-gray-500">{request.details}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{request.date}</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												request.statusColor === 'blue'
													? 'bg-blue-100 text-blue-800'
													: request.statusColor === 'red'
														? 'bg-red-100 text-red-800'
														: 'bg-green-100 text-green-800'
											}`}
										>
											{request.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex justify-between items-center mt-6">
					<span className="text-sm text-gray-600">Showing 1 to 10 of 105 records</span>
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

