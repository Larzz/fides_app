import { NextRequest, NextResponse } from 'next/server'
import {
	backendFetch,
	messageFromApiBody,
	readJsonSafe,
} from '@/lib/api-client'

export const dynamic = 'force-dynamic'

export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ id: string }> },
) {
	try {
		const token = request.cookies.get('auth_token')?.value
		if (!token) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		const { id } = await context.params
		const body = await request.json()

		const response = await backendFetch(`/files/${id}/notify`, {
			method: 'PATCH',
			token,
			body: JSON.stringify(body),
		})

		const data = await readJsonSafe(response)
		if (!response.ok) {
			return NextResponse.json(
				{ message: messageFromApiBody(data) },
				{ status: response.status },
			)
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('File notify error:', error)
		return NextResponse.json(
			{ message: 'Failed to update notification setting' },
			{ status: 500 },
		)
	}
}
