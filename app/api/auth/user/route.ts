import { NextRequest, NextResponse } from 'next/server'

/**
 * User Validation API Route
 * Validates the current user's token and returns user data
 */
export const dynamic = 'force-dynamic'

const API_URL = 'https://api.creativouae.com'

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get('auth_token')?.value

		if (!token) {
			return NextResponse.json(
				{ message: 'No authentication token found' },
				{ status: 401 }
			)
		}

		// Validate token with Laravel backend
		const response = await fetch(`${API_URL}/api/user`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
			credentials: 'include',
		})

		if (!response.ok) {
			// Token is invalid or expired
			const errorResponse = NextResponse.json(
				{ message: 'Invalid or expired token' },
				{ status: 401 }
			)

			// Clear invalid token
			errorResponse.cookies.delete('auth_token')
			return errorResponse
		}

		const userData = await response.json()

		return NextResponse.json({
			success: true,
			user: userData,
		})
	} catch (error) {
		console.error('User validation error:', error)
		return NextResponse.json(
			{ message: 'An error occurred during user validation' },
			{ status: 500 }
		)
	}
}

