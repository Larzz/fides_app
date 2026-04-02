import { Sidebar } from './sidebar'
import { RightSidebar } from './right-sidebar'
import type { DashboardActivityRow, DashboardNotificationItem } from '@/lib/dashboard-service'

interface PageLayoutProps {
	children: React.ReactNode
	title?: string
	notifications?: DashboardNotificationItem[]
	activities?: DashboardActivityRow[]
}

export function PageLayout({
	children,
	title = 'Welcome, Sarah 👋',
	notifications,
	activities,
}: PageLayoutProps) {
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<main className="flex-1 p-8" id="main-container">
				<header className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">{title}</h1>
					<button className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300"></button>
				</header>
				<div className="flex gap-8">
					<div className="flex-1 min-w-0">{children}</div>
					<RightSidebar
						notifications={notifications}
						activities={activities}
					/>
				</div>
			</main>
		</div>
	)
}

