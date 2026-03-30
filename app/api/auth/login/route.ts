import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api'

/**
 * Login API Route
 * This proxies login requests to your Laravel backend with Sanctum authentication
 */
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { email, password, rememberMe } = body

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			)
		}

		// Call backend auth API
		const response = await fetch(`${getApiUrl()}/fides_api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			credentials: 'include', // Important for Sanctum cookies
			body: JSON.stringify({ email, password }),
		})

		const data = await response.json()

		if (!response.ok) {
			return NextResponse.json(
				{ message: data.message || 'Authentication failed' },
				{ status: response.status }
			)
		}

		// Extract token from response (Sanctum may use different keys or nest in .data)
		const token =
			data.token ??
			data.access_token ??
			data.accessToken ??
			data.bearer_token ??
			(typeof data.data === 'object' && data.data?.token) ??
			(typeof data.data === 'object' && data.data?.access_token)

		const tokenStr =
			typeof token === 'string'
				? token.trim()
				: token != null
					? String(token).trim()
					: ''
		if (!tokenStr) {
			console.error('Login succeeded but no token in response:', Object.keys(data))
			return NextResponse.json(
				{
					message:
						'Backend did not return an auth token. Ensure the API returns token, access_token, or accessToken in the JSON body.',
				},
				{ status: 502 }
			)
		}

		// Create response with user data
		const nextResponse = NextResponse.json({
			success: true,
			user: data.user ?? data.data?.user,
		})

		const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
		const isProduction = process.env.NODE_ENV === 'production'

		// Set HTTP-only cookie (secure: false in dev so it works on localhost)
		nextResponse.cookies.set('auth_token', tokenStr, {
			httpOnly: true,
			secure: isProduction,
			sameSite: 'lax',
			maxAge,
			path: '/',
		})

		// Forward all Set-Cookie headers from Laravel (getSetCookie returns array)
		const setCookieHeaders =
			typeof response.headers.getSetCookie === 'function'
				? response.headers.getSetCookie()
				: [response.headers.get('set-cookie')].filter(Boolean)
		for (const cookieStr of setCookieHeaders) {
			if (!cookieStr) continue
			const [nameValue, ...rest] = cookieStr.split(';').map((s) => s.trim())
			const eq = nameValue.indexOf('=')
			if (eq === -1) continue
			const name = nameValue.slice(0, eq).trim()
			const value = nameValue.slice(eq + 1).trim()
			if (!name || !value) continue
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
		return NextResponse.json(
			{ message: 'An error occurred during login' },
			{ status: 500 }
		)
	}
}

