'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Sidebar() {
	const pathname = usePathname()
	const [userManagementOpen, setUserManagementOpen] = useState(
		pathname?.startsWith('/employees') || pathname?.startsWith('/clients')
	)
	const [workToolsOpen, setWorkToolsOpen] = useState(
		pathname?.startsWith('/tools-subscriptions') || pathname?.startsWith('/access-management')
	)

	const isActive = (path: string) => pathname === path
	const isActiveParent = (paths: string[]) => paths.some((path) => pathname?.startsWith(path))

	return (
		<aside className="w-64 bg-white border-r border-gray-200 p-6">
			{/* Logo */}
			<div className="flex items-center mb-8 justify-center">
				<Image src="/assets/logo.png" alt="logo" width={120} height={40} />
			</div>

			{/* Search */}
			<div className="relative mb-8">
				<input
					type="text"
					placeholder="Search users, files..."
					className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
				/>
				<button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-orange-500 rounded-full border border-orange-600 flex items-center justify-center hover:bg-orange-600">
					<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>

			{/* Navigation */}
			<nav className="space-y-2">
				<Link
					href="/"
					className={`flex items-center px-4 py-2 rounded-lg text-sm ${
						isActive('/')
							? 'bg-orange-500 text-white'
							: 'text-gray-700 hover:bg-gray-100'
					}`}
				>
					<svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
					Dashboard
				</Link>
				<div className="relative">
					<button
						onClick={() => setUserManagementOpen(!userManagementOpen)}
						className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm ${
							isActiveParent(['/employees', '/clients'])
								? 'bg-orange-500 text-white'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						<div className="flex items-center">
							<svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
							User Management
						</div>
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{userManagementOpen && (
						<div className="mt-2 ml-8 space-y-1">
							<Link
								href="/employees"
								className={`flex items-center px-4 py-2 rounded-lg text-xs ${
									isActive('/employees')
										? 'bg-orange-500 text-white'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
							>
								Employees
							</Link>
							<Link
								href="/clients"
								className={`flex items-center px-4 py-2 rounded-lg text-xs ${
									isActive('/clients')
										? 'bg-orange-500 text-white'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
							>
								Clients
							</Link>
						</div>
					)}
				</div>
				<Link
					href="/approvals"
					className={`flex items-center px-4 py-2 rounded-lg text-sm ${
						isActive('/approvals')
							? 'bg-orange-500 text-white'
							: 'text-gray-700 hover:bg-gray-100'
					}`}
				>
					<svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Approvals
				</Link>
				<Link
					href="/work-policies"
					className={`flex items-center px-4 py-2 rounded-lg text-sm ${
						isActive('/work-policies')
							? 'bg-orange-500 text-white'
							: 'text-gray-700 hover:bg-gray-100'
					}`}
				>
					<svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Work Policies
				</Link>
				<Link
					href="/content-upload"
					className={`flex items-center px-4 py-2 rounded-lg text-sm ${
						isActive('/content-upload')
							? 'bg-orange-500 text-white'
							: 'text-gray-700 hover:bg-gray-100'
					}`}
				>
					<svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
					Content Upload
				</Link>
				<div className="relative">
					<button
						onClick={() => setWorkToolsOpen(!workToolsOpen)}
						className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm ${
							isActiveParent(['/tools-subscriptions', '/access-management'])
								? 'bg-orange-500 text-white'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						<div className="flex items-center">
							<svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Work Tools
						</div>
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{workToolsOpen && (
						<div className="mt-2 ml-8 space-y-1">
							<Link
								href="/tools-subscriptions"
								className={`flex items-center px-4 py-2 rounded-lg text-xs ${
									isActive('/tools-subscriptions')
										? 'bg-orange-500 text-white'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
							>
								Tools & Subscriptions
							</Link>
							<Link
								href="/access-management"
								className={`flex items-center px-4 py-2 rounded-lg text-xs ${
									isActive('/access-management')
										? 'bg-orange-500 text-white'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
							>
								Access Management
							</Link>
						</div>
					)}
				</div>
				<Link
					href="/system-logs"
					className={`flex items-center px-4 py-2 rounded-lg text-sm ${
						isActive('/system-logs')
							? 'bg-orange-500 text-white'
							: 'text-gray-700 hover:bg-gray-100'
					}`}
				>
					<svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
					System Logs
				</Link>
			</nav>
		</aside>
	)
}

