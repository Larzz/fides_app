import { PageLayout } from '@/components/page-layout'
import { getFidesPageData } from '@/lib/fides-api'

export const dynamic = 'force-dynamic'

interface ToolsSubscriptionsPageData {
	title?: string
	description?: string
}

export default async function ToolsSubscriptionsPage() {
	const pageData = await getFidesPageData<ToolsSubscriptionsPageData>(
		'tools-subscriptions',
		{},
	)
	const title = pageData.title || 'Welcome, Sarah 👋'
	const description =
		pageData.description || 'Manage your tools and subscriptions here.'

	return (
		<PageLayout title={title}>
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-lg font-semibold text-gray-800 mb-4">Tools & Subscriptions</h2>
				<p className="text-sm text-gray-600">{description}</p>
			</div>
		</PageLayout>
	)
}

