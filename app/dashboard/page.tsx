import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { FileNotifyToggle } from '@/components/file-notify-toggle'
import {
	loadDashboardPageData,
	statusBadgeClass,
} from '@/lib/dashboard-service'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
	const data = await loadDashboardPageData()
	const title = `Welcome, ${data.userName} 👋`

	const m = data.metrics
	const pending = m?.pending_approvals_count ?? '—'
	const activeUsers = m?.active_users_count ?? '—'
	const uploads = m?.uploads_last_7_days ?? '—'
	const logins = m?.logins_today ?? '—'

	const { items: approvals, pagination: ap } = data.approvals
	const from =
		ap.total === 0 ? 0 : (ap.currentPage - 1) * ap.perPage + 1
	const to =
		ap.total === 0
			? 0
			: Math.min(ap.currentPage * ap.perPage, ap.total)

	return (
		<PageLayout
			title={title}
			notifications={data.notifications.items}
			activities={data.activities.items}
		>
			<div className="grid grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">
							{pending}
						</span>
						<div className="w-2 h-2 bg-gray-800 rounded-full" />
					</div>
					<div className="text-sm font-semibold text-gray-700 mt-2">
						Pending Approvals
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">
							{activeUsers}
						</span>
						<div className="w-2 h-2 bg-gray-800 rounded-full" />
					</div>
					<div className="text-sm font-semibold text-gray-700 mt-2">
						Active Users
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">
							{uploads}
						</span>
						<div className="w-2 h-2 bg-gray-800 rounded-full" />
					</div>
					<div className="text-sm font-semibold text-gray-700 mt-2">
						File Uploads (last 7 days)
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">
							{logins}
						</span>
						<div className="w-2 h-2 bg-gray-800 rounded-full" />
					</div>
					<div className="text-sm font-semibold text-gray-700 mt-2">
						Logins Today
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">
						Request Approvals
					</h2>
					<Link
						href="/approvals"
						className="px-4 py-2 bg-orange-500 text-white rounded-lg border border-orange-600 text-sm font-medium hover:bg-orange-600"
					>
						VIEW ALL
					</Link>
				</div>
				<div className="flex flex-wrap justify-between items-center gap-3 mb-4">
					<button
						type="button"
						className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
					>
						EXPORT
					</button>
					<div className="flex flex-wrap gap-3">
						<div className="relative">
							<input
								type="text"
								placeholder="Search..."
								className="px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
							/>
							<span className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center pointer-events-none">
								<svg
									className="w-3 h-3 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</span>
						</div>
						<button
							type="button"
							className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50"
						>
							Status ▼
						</button>
						<button
							type="button"
							className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50"
						>
							Request Type ▼
						</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Request Type ↓
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									User ↓
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Details
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Submitted On ↓
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Status ↓
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{approvals.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-8 text-sm text-center text-gray-500"
									>
										No approval requests yet.
									</td>
								</tr>
							) : (
								approvals.map((request) => (
									<tr key={request.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-900 capitalize">
											{request.type}
										</td>
										<td className="px-4 py-3 text-sm text-gray-700">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />
												{request.userName}
											</div>
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">
											{request.details}
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">
											{request.submittedLabel}
										</td>
										<td className="px-4 py-3 text-sm">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass(request.status)}`}
											>
												{request.status}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="flex justify-between items-center mt-6 flex-wrap gap-2">
					<span className="text-sm text-gray-600">
						Showing {from} to {to} of {ap.total} records
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex justify-between items-center mb-4 flex-wrap gap-2">
						<h2 className="text-lg font-semibold text-gray-800">
							Content Upload Center
						</h2>
						<div className="flex gap-2">
							<Link
								href="/content-upload"
								className="px-3 py-2 text-orange-500 border border-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50"
							>
								VIEW ALL
							</Link>
							<Link
								href="/content-upload"
								className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
							>
								UPLOAD
							</Link>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
										File
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
										Uploaded By
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
										Shared With
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
										Notify
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{data.files.items.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="px-3 py-6 text-sm text-gray-500 text-center"
										>
											No files yet.
										</td>
									</tr>
								) : (
									data.files.items.map((f) => (
										<tr key={f.id} className="hover:bg-gray-50">
											<td className="px-3 py-2 text-sm text-gray-900">
												{f.title}
											</td>
											<td className="px-3 py-2 text-sm text-gray-700">
												<div className="flex items-center gap-2">
													<div className="w-6 h-6 rounded-full bg-gray-300 shrink-0" />
													{f.uploaderName}
												</div>
											</td>
											<td className="px-3 py-2 text-sm text-gray-600">
												{f.sharedLabel}
											</td>
											<td className="px-3 py-2">
												<FileNotifyToggle
													fileId={f.id}
													initialOn={f.notifyStakeholders}
												/>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex justify-between items-center mb-4 flex-wrap gap-2">
						<h2 className="text-lg font-semibold text-gray-800">
							User Access Management
						</h2>
						<div className="flex gap-2">
							<Link
								href="/employees"
								className="px-3 py-2 text-orange-500 border border-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50"
							>
								VIEW ALL
							</Link>
							<Link
								href="/employees"
								className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
							>
								ADD
							</Link>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
										User
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
										User Type
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{data.users.items.length === 0 ? (
									<tr>
										<td
											colSpan={2}
											className="px-3 py-6 text-sm text-gray-500 text-center"
										>
											No users loaded.
										</td>
									</tr>
								) : (
									data.users.items.map((u) => (
										<tr key={u.id} className="hover:bg-gray-50">
											<td className="px-3 py-2 text-sm text-gray-900">
												<div className="flex items-center gap-2">
													<div className="w-6 h-6 rounded-full bg-gray-300 shrink-0" />
													{u.name}
												</div>
											</td>
											<td className="px-3 py-2 text-sm text-gray-600 capitalize">
												{u.roleLabel}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</PageLayout>
	)
}
