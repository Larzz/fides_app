import { PageLayout } from '@/components/page-layout'

export default function ContentUploadPage() {
	return (
		<PageLayout title="Welcome, Sarah 👋">
			{/* Archived Files Card */}
			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div className="flex items-center justify-between">
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-gray-800">30</span>
						<div>
							<div className="text-sm font-semibold text-gray-700">Archived Files</div>
						</div>
					</div>
					<button className="text-sm text-orange-500 font-medium hover:text-orange-600">VIEW</button>
				</div>
			</div>

			{/* Files Table */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-4">
					<div className="flex gap-3">
						<button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
							UPLOAD
						</button>
						<button className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50">
							EXPORT
						</button>
					</div>
					<div className="flex gap-3">
						<div className="relative">
							<input
								type="text"
								placeholder="Search file name..."
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
							Category ▼
						</button>
						<button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50">
							Shared With ▼
						</button>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">File Name ↓</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Uploaded By</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Shared With</th>
								<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Upload Date ↓</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{ name: 'Q1 Company Update.pdf', category: 'Reports', uploadedBy: 'Admin', sharedWith: 'Company-wide', date: '22 Jan 2026' },
								{ name: 'SEO Report - Jan.pdf', category: 'Reports', uploadedBy: 'Ahmed R.', sharedWith: 'Alpha Corp', date: '21 Jan 2026' },
								{ name: 'Invoice - Feb.pdf', category: 'Invoices', uploadedBy: 'Admin', sharedWith: 'Nova LLC', date: '20 Jan 2026' },
								{ name: 'Contract Renewal.pdf', category: 'Contracts', uploadedBy: 'Admin', sharedWith: 'Alpha Corp', date: '19 Jan 2026' },
								{ name: 'Marketing Deck.pptx', category: 'Presentations', uploadedBy: 'Lina M.', sharedWith: 'Company-wide', date: '18 Jan 2026' },
							].map((file, idx) => (
								<tr key={idx} className="hover:bg-gray-50">
									<td className="px-4 py-3 text-sm text-gray-900">{file.name}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{file.category}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{file.uploadedBy}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{file.sharedWith}</td>
									<td className="px-4 py-3 text-sm text-gray-500">{file.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</PageLayout>
	)
}

