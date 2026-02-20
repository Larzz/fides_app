import { PageLayout } from '@/components/page-layout'

export default function WorkPoliciesPage() {
	return (
		<PageLayout title="Welcome, Sarah 👋">
			{/* Info Cards */}
			<div className="grid grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-center gap-3">
						<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<div className="text-sm font-semibold text-gray-700">13 days of Public Holidays</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-center gap-3">
						<div className="w-3 h-3 bg-red-500 rounded-full"></div>
						<div>
							<div className="text-sm font-semibold text-gray-700">Summer WFH (Inactive)</div>
						</div>
					</div>
				</div>
			</div>

			{/* Public Holiday List */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">Public Holiday List</h2>
					<button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
						ADD PUBLIC HOLIDAY
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Holiday Name</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{ name: 'New Year\'s Day', date: '1 Jan 2026' },
								{ name: 'Eid Al Fitr', date: '10-12 Apr 2026' },
								{ name: 'Eid Al Adha', date: '16-18 Jun 2026' },
								{ name: 'National Day', date: '2-3 Dec 2026' },
							].map((holiday, idx) => (
								<tr key={idx} className="hover:bg-gray-50">
									<td className="px-4 py-3 text-sm text-gray-900">{holiday.name}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{holiday.date}</td>
									<td className="px-4 py-3 text-sm">
										<button className="text-orange-500 hover:text-orange-600">Edit</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</PageLayout>
	)
}

