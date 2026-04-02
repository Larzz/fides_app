import { NextRequest, NextResponse } from 'next/server'
import {
	backendFetch,
	messageFromApiBody,
	readJsonSafe,
} from '@/lib/api-client'

const DEFAULT_PATH = '/reset-password'

/**
 * Proxies password reset to the Laravel API when exposed
 * (e.g. `POST /api/reset-password`). Override with API_RESET_PASSWORD_PATH.
 */
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const path = process.env.API_RESET_PASSWORD_PATH?.trim() || DEFAULT_PATH
		const normalized = path.startsWith('/') ? path : `/${path}`

		const response = await backendFetch(normalized, {
			method: 'POST',
			body: JSON.stringify(body),
		})

		const data = await readJsonSafe(response)

		if (!response.ok) {
			return NextResponse.json(
				{ message: messageFromApiBody(data) },
				{ status: response.status },
			)
		}

		const message =
			data &&
			typeof data === 'object' &&
			'message' in data &&
			typeof (data as { message: unknown }).message === 'string'
				? (data as { message: string }).message
				: 'Password reset successful.'

		return NextResponse.json({ message, data })
	} catch (error) {
		console.error('Reset password proxy error:', error)
		return NextResponse.json(
			{ message: 'Could not reset password' },
			{ status: 500 },
		)
	}
}
