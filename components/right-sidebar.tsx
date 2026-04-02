import Link from 'next/link'
import type { DashboardActivityRow, DashboardNotificationItem } from '@/lib/dashboard-service'

interface RightSidebarProps {
	notifications?: DashboardNotificationItem[]
	activities?: DashboardActivityRow[]
}

export function RightSidebar({
	notifications = [],
	activities = [],
}: RightSidebarProps) {
	return (
		<aside className="w-80 shrink-0">
			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">
						Notifications
					</h2>
				</div>
				<div className="space-y-3">
					{notifications.length === 0 ? (
						<p className="text-sm text-gray-500">No notifications yet.</p>
					) : (
						notifications.map((n) => (
							<div key={n.id} className="notification-box-holder">
								<div className="text-xs text-gray-500 mb-2">
									{n.relativeLabel || 'Recently'}
								</div>
								<div className="text-sm font-medium text-gray-800 mb-1">
									{n.title}
								</div>
								{n.message ? (
									<div className="text-xs text-gray-600 mb-3 line-clamp-2">
										{n.message}
									</div>
								) : null}
								<div className="flex justify-end">
									<button
										type="button"
										className="px-3 py-1 text-xs text-orange-500 font-medium hover:text-orange-600 border border-orange-500 rounded-lg hover:bg-orange-50"
									>
										READ
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">
						System Activity Feed
					</h2>
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
										<svg
											className="w-3 h-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
											/>
										</svg>
									</div>
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
									User
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
									When
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{activities.length === 0 ? (
								<tr>
									<td
										colSpan={3}
										className="px-4 py-3 text-xs text-gray-500"
									>
										No recent activity.
									</td>
								</tr>
							) : (
								activities.map((row) => (
									<tr
										key={row.id || row.whenLabel + row.action}
										className="hover:bg-gray-50 border-b border-gray-100"
									>
										<td className="px-4 py-2 text-xs text-gray-900 capitalize">
											{row.action}
										</td>
										<td className="px-4 py-2 text-xs text-gray-700">
											{row.userLabel}
										</td>
										<td className="px-4 py-2 text-xs text-gray-500">
											{row.whenLabel}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</aside>
	)
}
