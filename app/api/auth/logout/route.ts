import { NextRequest, NextResponse } from 'next/server'

/**
 * Logout API Route
 * Handles user logout and clears authentication cookies
 */
export const dynamic = 'force-dynamic'

const API_URL = 'https://api.creativouae.com'

export async function POST(request: NextRequest) {
	try {
		const token = request.cookies.get('auth_token')?.value

		// Call Laravel logout endpoint if token exists
		if (token) {
			try {
				await fetch(`${API_URL}/api/logout`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
					},
					credentials: 'include',
				})
			} catch (error) {
				// Continue with logout even if backend call fails
				console.error('Logout API error:', error)
			}
		}

		// Create response
		const response = NextResponse.json({
			success: true,
			message: 'Logged out successfully',
		})

		// Clear all authentication cookies
		response.cookies.delete('auth_token')
		response.cookies.delete('sanctum_token')
		response.cookies.delete('laravel_session')

		return response
	} catch (error) {
		console.error('Logout error:', error)
		return NextResponse.json(
			{ message: 'An error occurred during logout' },
			{ status: 500 }
		)
	}
}

