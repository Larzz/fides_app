import { PageLayout } from '@/components/page-layout'
import { loadApprovalsPageData } from '@/lib/approvals-service'

export const dynamic = 'force-dynamic'

export default async function ApprovalsPage() {
	const data = await loadApprovalsPageData(15)
	const title = `Welcome, ${data.userName} 👋`
	const { items: approvals, pagination: ap } = data.approvals
	const from = ap.total === 0 ? 0 : (ap.currentPage - 1) * ap.perPage + 1
	const to =
		ap.total === 0 ? 0 : Math.min(ap.currentPage * ap.perPage, ap.total)

	return (
		<PageLayout title={title}>
			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex items-baseline gap-2">
					<span className="text-4xl font-bold text-gray-800">
						{data.pendingCount ?? '—'}
					</span>
					<div>
						<div className="text-sm font-semibold text-gray-700">
							Pending Requests
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<div className="flex gap-3">
						<button
							type="button"
							className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
						>
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
							<button
								type="button"
								className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
							>
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
							</button>
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
										No approvals found.
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
												className={`px-2 py-1 rounded-full text-xs font-medium ${request.statusBadgeClass}`}
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

				<div className="flex justify-between items-center mt-6">
					<span className="text-sm text-gray-600">
						Showing {from} to {to} of {ap.total} records
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium"
						>
							{ap.currentPage}
						</button>
						{ap.lastPage > 1 ? (
							<span className="text-sm text-gray-500 self-center">
								of {ap.lastPage}
							</span>
						) : null}
					</div>
				</div>
			</div>
		</PageLayout>
	)
}
