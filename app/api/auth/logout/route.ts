import { NextRequest, NextResponse } from 'next/server'
import { backendFetch } from '@/lib/api-client'
import { authPaths } from '@/lib/api-paths'

/**
 * Proxies logout to Laravel (`POST /api/logout`) and clears app cookies.
 */
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	try {
		const token = request.cookies.get('auth_token')?.value

		if (token) {
			try {
				await backendFetch(authPaths.logout, {
					method: 'POST',
					token,
					credentials: 'include',
				})
			} catch (error) {
				console.error('Logout API error:', error)
			}
		}

		const response = NextResponse.json({
			success: true,
			message: 'Logged out successfully',
		})

		response.cookies.delete('auth_token')
		response.cookies.delete('sanctum_token')
		response.cookies.delete('laravel_session')

		return response
	} catch (error) {
		console.error('Logout error:', error)
		return NextResponse.json(
			{ message: 'An error occurred during logout' },
			{ status: 500 },
		)
	}
}
