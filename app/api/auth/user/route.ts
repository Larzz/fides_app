import { NextRequest, NextResponse } from 'next/server'
import { backendFetch, readJsonSafe, type ApiEnvelope } from '@/lib/api-client'
import { authPaths } from '@/lib/api-paths'

/**
 * Validates the session against Laravel (`GET /api/me`).
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get('auth_token')?.value

		if (!token) {
			return NextResponse.json(
				{ message: 'No authentication token found' },
				{ status: 401 },
			)
		}

		const response = await backendFetch(authPaths.me, {
			method: 'GET',
			token,
			credentials: 'include',
		})

		if (!response.ok) {
			const errorResponse = NextResponse.json(
				{ message: 'Invalid or expired token' },
				{ status: 401 },
			)
			errorResponse.cookies.delete('auth_token')
			return errorResponse
		}

		const raw = await readJsonSafe(response)
		const user =
			raw &&
			typeof raw === 'object' &&
			'data' in raw &&
			(raw as ApiEnvelope<unknown>).data !== undefined
				? (raw as ApiEnvelope<unknown>).data
				: raw

		return NextResponse.json({
			success: true,
			user,
		})
	} catch (error) {
		console.error('User validation error:', error)
		return NextResponse.json(
			{ message: 'An error occurred during user validation' },
			{ status: 500 },
		)
	}
}
