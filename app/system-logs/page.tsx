import { PageLayout } from '@/components/page-layout'

export default function SystemLogsPage() {
	return (
		<PageLayout title="Welcome, Sarah 👋">
			{/* Activities Card */}
			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex items-baseline gap-2">
					<span className="text-4xl font-bold text-gray-800">18</span>
					<div>
						<div className="text-sm font-semibold text-gray-700">Activities Logged</div>
						<div className="text-xs text-gray-500">Today</div>
					</div>
				</div>
			</div>

			{/* System Logs Table */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
						EXPORT
					</button>
					<div className="flex gap-3">
						<div className="relative">
							<input
								type="text"
								placeholder="Search by user name..."
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
							Log Type ▼
						</button>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50">
							User Type ▼
						</button>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50 flex items-center gap-2">
							Date Range 📅
						</button>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Activity ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">When ↓</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{ activity: 'Logged in', user: 'Omer K.', when: '23 Jan 2026 09:14' },
								{ activity: 'Contract expiring', user: 'System', when: '23 Jan 2026 08:55' },
								{ activity: 'SEO viewed', user: 'Alpha Corp', when: '22 Jan 2026 16:40' },
								{ activity: 'Leave requested', user: 'Ahmed R.', when: '22 Jan 2026 15:10' },
								{ activity: 'File uploaded', user: 'Admin', when: '22 Jan 2026 14:30' },
								{ activity: 'Invoice downloaded', user: 'Nova LLC', when: '22 Jan 2026 12:20' },
								{ activity: 'Report uploaded', user: 'Admin', when: '21 Jan 2026 10:05' },
								{ activity: 'Contract uploaded', user: 'Admin', when: '21 Jan 2026 09:42' },
								{ activity: 'Presentation uploaded', user: 'Lina M.', when: '20 Jan 2026 16:18' },
							].map((log, idx) => (
								<tr key={idx} className="hover:bg-gray-50">
									<td className="px-4 py-3 text-sm text-gray-900">{log.activity}</td>
									<td className="px-4 py-3 text-sm text-gray-700">{log.user}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{log.when}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</PageLayout>
	)
}

