import { NextRequest, NextResponse } from 'next/server'

/**
 * Login API Route
 * This proxies login requests to your Laravel backend
 * 
 * TODO: Update the API_URL to match your Laravel backend URL
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { email, password } = body

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			)
		}

		// Call your Laravel API
		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})

		const data = await response.json()

		if (!response.ok) {
			return NextResponse.json(
				{ message: data.message || 'Authentication failed' },
				{ status: response.status }
			)
		}

		// Return the token to be stored in cookies by the client
		return NextResponse.json({
			token: data.token || data.access_token,
			user: data.user,
		})
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json(
			{ message: 'An error occurred during login' },
			{ status: 500 }
		)
	}
}

