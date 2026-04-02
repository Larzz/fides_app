import { PageLayout } from '@/components/page-layout'
import { loadWorkPoliciesPageData } from '@/lib/work-policies-service'

export const dynamic = 'force-dynamic'

export default async function WorkPoliciesPage() {
	const data = await loadWorkPoliciesPageData()
	const title = `Welcome, ${data.userName} 👋`

	return (
		<PageLayout title={title}>
			<div className="grid grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-center gap-3">
						<svg
							className="w-6 h-6 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<div className="text-sm font-semibold text-gray-700">
								{data.publicHolidaySummary}
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-center gap-3">
						<div className="w-3 h-3 bg-red-500 rounded-full shrink-0" />
						<div>
							<div className="text-sm font-semibold text-gray-700">
								{data.inactiveSummary}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-800">
						Public Holiday List
					</h2>
					<button
						type="button"
						className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
					>
						ADD PUBLIC HOLIDAY
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Holiday Name
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Date
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{data.holidays.items.length === 0 ? (
								<tr>
									<td
										colSpan={3}
										className="px-4 py-8 text-sm text-center text-gray-500"
									>
										No holidays found. Add work tools with category &quot;
										{data.holidayCategory}&quot; (POST /api/work-tools).
									</td>
								</tr>
							) : (
								data.holidays.items.map((holiday) => (
									<tr key={holiday.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-900">
											{holiday.name}
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">
											{holiday.dateLabel}
										</td>
										<td className="px-4 py-3 text-sm">
											<button
												type="button"
												className="text-orange-500 hover:text-orange-600"
											>
												Edit
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</PageLayout>
	)
}
