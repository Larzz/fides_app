import { PageLayout } from '@/components/page-layout'
import { getFidesPageData } from '@/lib/fides-api'

export const dynamic = 'force-dynamic'

interface AccessManagementPageData {
	title?: string
	description?: string
}

export default async function AccessManagementPage() {
	const pageData = await getFidesPageData<AccessManagementPageData>(
		'access-management',
		{},
	)
	const title = pageData.title || 'Welcome, Sarah 👋'
	const description =
		pageData.description || 'Manage user access and permissions here.'

	return (
		<PageLayout title={title}>
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-lg font-semibold text-gray-800 mb-4">Access Management</h2>
				<p className="text-sm text-gray-600">{description}</p>
			</div>
		</PageLayout>
	)
}

