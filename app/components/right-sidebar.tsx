import Link from 'next/link'

export function RightSidebar() {
	return (
		<aside className="w-80">
			{/* Notifications */}
			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
				</div>
				<div className="space-y-3">
					<div className="notification-box-holder">
						<div className="text-xs text-gray-500 mb-2">5 min ago</div>
						<div className="text-sm font-medium text-gray-800 mb-1">File viewed by client</div>
						<div className="text-xs text-gray-600 mb-3">Nova LLC · Invoice - Feb 2026</div>
						<div className="flex justify-end">
							<button className="px-3 py-1 text-xs text-orange-500 font-medium hover:text-orange-600 border border-orange-500 rounded-lg hover:bg-orange-50">
								READ
							</button>
						</div>
					</div>
					<div className="notification-box-holder">
						<div className="text-xs text-gray-500 mb-2">1 hr ago</div>
						<div className="text-sm font-medium text-gray-800 mb-1">Ticket allowance request submitted</div>
						<div className="text-xs text-gray-600 mb-3">Lina M. · Invoice - Feb 2026</div>
						<div className="flex justify-end">
							<button className="px-3 py-1 text-xs text-orange-500 font-medium hover:text-orange-600 border border-orange-500 rounded-lg hover:bg-orange-50">
								VIEW
							</button>
						</div>
					</div>
					<div className="notification-box-holder">
						<div className="text-xs text-gray-500 mb-2">Yesterday</div>
						<div className="text-sm font-medium text-gray-800 mb-1">Contract expiring soon</div>
						<div className="text-xs text-gray-600 mb-3">Alpha Corp · 14 days remaining</div>
						<div className="flex justify-end">
							<button className="px-3 py-1 text-xs text-orange-500 font-medium hover:text-orange-600 border border-orange-500 rounded-lg hover:bg-orange-50">
								READ
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* System Activity Feed */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">System Activity Feed</h2>
					<Link
						href="/system-logs"
						className="px-4 py-2 bg-orange-500 text-white rounded-lg border border-orange-600 text-sm font-medium hover:bg-orange-600"
					>
						VIEW ALL
					</Link>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
									<div className="flex items-center gap-2">
										Activity
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
											/>
										</svg>
									</div>
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">User</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">When</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">Logged in</td>
								<td className="px-4 py-2 text-xs text-gray-700">Omer K.</td>
								<td className="px-4 py-2 text-xs text-gray-500">23 Jan 2026 09:14</td>
							</tr>
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">Contract expiring</td>
								<td className="px-4 py-2 text-xs text-gray-700">System</td>
								<td className="px-4 py-2 text-xs text-gray-500">23 Jan 2026 08:55</td>
							</tr>
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">SEO viewed</td>
								<td className="px-4 py-2 text-xs text-gray-700">Alpha Corp</td>
								<td className="px-4 py-2 text-xs text-gray-500">22 Jan 2026 16:40</td>
							</tr>
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">Leave requested</td>
								<td className="px-4 py-2 text-xs text-gray-700">Ahmed R.</td>
								<td className="px-4 py-2 text-xs text-gray-500">22 Jan 2026 15:10</td>
							</tr>
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">File uploaded</td>
								<td className="px-4 py-2 text-xs text-gray-700">Admin</td>
								<td className="px-4 py-2 text-xs text-gray-500">22 Jan 2026 14:30</td>
							</tr>
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">Invoice downloaded</td>
								<td className="px-4 py-2 text-xs text-gray-700">Nova LLC</td>
								<td className="px-4 py-2 text-xs text-gray-500">22 Jan 2026 12:20</td>
							</tr>
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">Report uploaded</td>
								<td className="px-4 py-2 text-xs text-gray-700">Admin</td>
								<td className="px-4 py-2 text-xs text-gray-500">21 Jan 2026 10:05</td>
							</tr>
							<tr className="hover:bg-gray-50 border-b border-gray-100">
								<td className="px-4 py-2 text-xs text-gray-900">Contract uploaded</td>
								<td className="px-4 py-2 text-xs text-gray-700">Admin</td>
								<td className="px-4 py-2 text-xs text-gray-500">21 Jan 2026 09:42</td>
							</tr>
							<tr className="hover:bg-gray-50">
								<td className="px-4 py-2 text-xs text-gray-900">Presentation uploaded</td>
								<td className="px-4 py-2 text-xs text-gray-700">Lina M.</td>
								<td className="px-4 py-2 text-xs text-gray-500">20 Jan 2026 16:18</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</aside>
	)
}

