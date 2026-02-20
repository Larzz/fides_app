import { PageLayout } from '@/components/page-layout'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <PageLayout title="Welcome, Sarah 👋">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-800">4</span>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
          <div className="text-sm font-semibold text-gray-700 mt-2">
            Pending Approvals
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-800">23</span>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
          <div className="text-sm font-semibold text-gray-700 mt-2">
            Active Users
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-800">42</span>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
          <div className="text-sm font-semibold text-gray-700 mt-2">
            File Uploads (last 7 days)
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-800">9</span>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
          <div className="text-sm font-semibold text-gray-700 mt-2">
            Logins Today
          </div>
        </div>
      </div>

      {/* Request Approvals */}
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

        {/* Table content remains unchanged */}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Content Upload Center */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Content unchanged */}
        </div>

        {/* User Access Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Content unchanged */}
        </div>
      </div>
    </PageLayout>
  )
}
