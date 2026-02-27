import { NextRequest, NextResponse } from 'next/server'

/**
 * Login API Route
 * This proxies login requests to your Laravel backend with Sanctum authentication
 */
export const dynamic = 'force-dynamic'

const API_URL = 'https://api.creativouae.com'

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

		// Call your Laravel API with Sanctum
		const response = await fetch(`${API_URL}/api/login`, {
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

		// Create response with user data
		const nextResponse = NextResponse.json({
			success: true,
			user: data.user,
		})

		// Extract token from response (Sanctum may return token in body or set cookie)
		const token = data.token || data.access_token

		// Set HTTP-only cookie for Sanctum token (more secure)
		if (token) {
			const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
			nextResponse.cookies.set('auth_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge,
				path: '/',
			})
		}

		// Forward Sanctum cookies from Laravel if present
		const setCookieHeader = response.headers.get('set-cookie')
		if (setCookieHeader) {
			// Parse and forward Sanctum session cookies
			const cookies = setCookieHeader.split(',')
			cookies.forEach((cookie) => {
				const [nameValue] = cookie.split(';')
				const [name, value] = nameValue.trim().split('=')
				if (name && value && (name.includes('sanctum') || name.includes('laravel_session'))) {
					nextResponse.cookies.set(name, value, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'lax',
						path: '/',
					})
				}
			})
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

