import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
	'/login',
	'/forgot-password',
	'/reset-password',
]

/**
 * API routes that don't require authentication
 */
const publicApiRoutes = [
	'/api/auth/login',
	'/api/auth/logout',
]

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
	return publicRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Check if an API route is public
 */
function isPublicApiRoute(pathname: string): boolean {
	return publicApiRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Check if user is authenticated by validating token with backend
 * For Sanctum, we check for the auth_token cookie
 */
async function isAuthenticated(request: NextRequest): Promise<boolean> {
	// Check for Sanctum token in cookies
	const token = request.cookies.get('auth_token')?.value

	if (!token) {
		return false
	}

	// For production, you should validate the token with your backend
	// For now, we'll do a basic check. In production, make an API call to verify
	// the token is still valid and not expired
	try {
		// Optionally validate token with backend (uncomment for production)
		// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.creativouae.com'
		// const response = await fetch(`${API_URL}/api/user`, {
		// 	method: 'GET',
		// 	headers: {
		// 		Authorization: `Bearer ${token}`,
		// 		Accept: 'application/json',
		// 	},
		// 	credentials: 'include',
		// })
		// return response.ok

		// Basic check: token exists and is not empty
		return token.length > 0
	} catch (error) {
		console.error('Token validation error:', error)
		return false
	}
}

/**
 * Next.js Middleware
 * Runs on every request before the page is rendered
 */
export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Allow public API routes
	if (pathname.startsWith('/api') && isPublicApiRoute(pathname)) {
		return NextResponse.next()
	}

	// Allow public routes
	if (isPublicRoute(pathname)) {
		// If user is already authenticated and tries to access login, redirect to dashboard
		if (pathname === '/login') {
			const authenticated = await isAuthenticated(request)
			if (authenticated) {
				return NextResponse.redirect(new URL('/', request.url))
			}
		}
		return NextResponse.next()
	}

	// Protect all other routes (including API routes that aren't public)
	const authenticated = await isAuthenticated(request)
	if (!authenticated) {
		// For API routes, return 401 instead of redirecting
		if (pathname.startsWith('/api')) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// For pages, redirect to login with the original URL as a query parameter
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}

