import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { loadSystemLogsPageData } from '@/lib/system-logs-service'

export const dynamic = 'force-dynamic'

type SearchProps = { searchParams: Promise<{ page?: string }> }

function SortChevron() {
	return (
		<svg
			className="w-3 h-3 inline-block ml-1 text-gray-400"
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
	)
}

export default async function SystemLogsPage({ searchParams }: SearchProps) {
	const params = await searchParams
	const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)
	const data = await loadSystemLogsPageData({ page, perPage: 10 })

	const title = `Welcome, ${data.userName} 👋`
	const { pagination: ap } = data.logs
	const from = ap.total === 0 ? 0 : (ap.currentPage - 1) * ap.perPage + 1
	const to =
		ap.total === 0 ? 0 : Math.min(ap.currentPage * ap.perPage, ap.total)

	const blockStart = Math.floor((ap.currentPage - 1) / 5) * 5 + 1
	const blockEnd = Math.min(blockStart + 4, ap.lastPage)
	const pageNumbers = Array.from(
		{ length: Math.max(0, blockEnd - blockStart + 1) },
		(_, i) => blockStart + i,
	)

	return (
		<PageLayout
			title={title}
			notifications={data.notifications}
			activities={data.activities}
		>
			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex items-baseline gap-2">
					<span className="text-4xl font-bold text-gray-800">
						{data.activitiesLoggedToday ?? '—'}
					</span>
					<div>
						<div className="text-sm font-semibold text-gray-700">
							Activities Logged
						</div>
						<div className="text-xs text-gray-500">Today</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex flex-wrap justify-between items-center gap-4 mb-4">
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
								placeholder="Search by user name..."
								className="px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[200px]"
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
							Log Type ▼
						</button>
						<button
							type="button"
							className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50"
						>
							User Type ▼
						</button>
						<button
							type="button"
							className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50 flex items-center gap-2"
						>
							Date Range 📅
						</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Activity
									<SortChevron />
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									User
									<SortChevron />
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									When
									<SortChevron />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{data.loadError ? (
								<tr>
									<td
										colSpan={3}
										className="px-4 py-8 text-sm text-center text-gray-600"
									>
										Could not load system logs. Try again or check your
										permissions.
									</td>
								</tr>
							) : data.logs.items.length === 0 ? (
								<tr>
									<td
										colSpan={3}
										className="px-4 py-8 text-sm text-center text-gray-500"
									>
										No activity records found.
									</td>
								</tr>
							) : (
								data.logs.items.map((log, idx) => (
									<tr
										key={`${ap.currentPage}-${idx}-${log.whenLabel}`}
										className="hover:bg-gray-50"
									>
										<td className="px-4 py-3 text-sm text-gray-900">
											{log.action}
										</td>
										<td className="px-4 py-3 text-sm text-gray-700">
											{log.userLabel}
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">
											{log.whenLabel}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-wrap justify-between items-center gap-4 mt-6">
					<span className="text-sm text-gray-600">
						Showing {from} to {to} of{' '}
						{ap.total.toLocaleString('en-AE')} records
					</span>
					<div className="flex items-center gap-2 flex-wrap">
						{ap.currentPage > 1 ? (
							<Link
								href={`/system-logs?page=${ap.currentPage - 1}`}
								className="w-8 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm hover:bg-gray-50"
							>
								‹
							</Link>
						) : null}
						{pageNumbers.map((p) => (
							<Link
								key={p}
								href={`/system-logs?page=${p}`}
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
									p === ap.currentPage
										? 'bg-orange-500 text-white'
										: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
								}`}
							>
								{p}
							</Link>
						))}
						{ap.currentPage < ap.lastPage ? (
							<Link
								href={`/system-logs?page=${ap.currentPage + 1}`}
								className="w-8 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm hover:bg-gray-50"
							>
								›
							</Link>
						) : null}
						{ap.currentPage < ap.lastPage ? (
							<Link
								href={`/system-logs?page=${ap.lastPage}`}
								className="w-8 h-8 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm hover:bg-gray-50"
							>
								»
							</Link>
						) : null}
					</div>
				</div>
			</div>
		</PageLayout>
	)
}
