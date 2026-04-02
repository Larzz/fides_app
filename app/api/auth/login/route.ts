import { NextRequest, NextResponse } from 'next/server'
import {
	backendFetch,
	messageFromApiBody,
	readJsonSafe,
} from '@/lib/api-client'
import { extractTokenFromLoginBody } from '@/lib/backend-auth'
import { authPaths } from '@/lib/api-paths'

/**
 * Proxies login to Laravel Sanctum API (`POST /api/login`).
 */
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { email, password, rememberMe } = body

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 },
			)
		}

		const response = await backendFetch(authPaths.login, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			credentials: 'include',
		})

		const data = await readJsonSafe(response)

		if (!response.ok) {
			return NextResponse.json(
				{ message: messageFromApiBody(data) },
				{ status: response.status },
			)
		}

		const tokenStr = extractTokenFromLoginBody(data)
		if (!tokenStr) {
			console.error(
				'Login succeeded but no token in response:',
				data && typeof data === 'object' ? Object.keys(data) : data,
			)
			return NextResponse.json(
				{
					message:
						'Backend did not return an auth token. Expected token in the JSON body.',
				},
				{ status: 502 },
			)
		}

		const payload =
			data && typeof data === 'object'
				? (data as Record<string, unknown>)
				: {}
		const inner =
			payload.data && typeof payload.data === 'object'
				? (payload.data as Record<string, unknown>)
				: null
		const user =
			(inner?.user as unknown) ?? (payload.user as unknown) ?? null

		const nextResponse = NextResponse.json({
			success: true,
			user,
		})

		const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24
		const isProduction = process.env.NODE_ENV === 'production'

		nextResponse.cookies.set('auth_token', tokenStr, {
			httpOnly: true,
			secure: isProduction,
			sameSite: 'lax',
			maxAge,
			path: '/',
		})

		const setCookieHeaders =
			typeof response.headers.getSetCookie === 'function'
				? response.headers.getSetCookie()
				: [response.headers.get('set-cookie')].filter(Boolean)
		for (const cookieStr of setCookieHeaders) {
			if (!cookieStr) {
				continue
			}
			const [nameValue] = cookieStr.split(';').map((s) => s.trim())
			const eq = nameValue.indexOf('=')
			if (eq === -1) {
				continue
			}
			const name = nameValue.slice(0, eq).trim()
			const value = nameValue.slice(eq + 1).trim()
			if (!name || !value) {
				continue
			}
			if (
				name.includes('sanctum') ||
				name.includes('laravel_session') ||
				name.includes('XSRF')
			) {
				nextResponse.cookies.set(name, value, {
					httpOnly: !name.includes('XSRF'),
					secure: isProduction,
					sameSite: 'lax',
					path: '/',
				})
			}
		}

		return nextResponse
	} catch (error) {
		console.error('Login error:', error)
		if (error instanceof Error && error.name === 'AbortError') {
			return NextResponse.json(
				{
					message:
						'Could not reach the API in time. Ensure Laravel is running and ' +
						'set API_BASE_URL to http://127.0.0.1:8000/api (avoid "localhost" ' +
						'on macOS/Node, which often targets IPv6 while php artisan serve ' +
						'listens on IPv4).',
				},
				{ status: 504 },
			)
		}
		return NextResponse.json(
			{ message: 'An error occurred during login' },
			{ status: 500 },
		)
	}
}
