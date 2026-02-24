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
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
	return publicRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Check if user is authenticated
 * This checks for a JWT token in cookies
 * You can customize this based on your auth implementation
 */
function isAuthenticated(request: NextRequest): boolean {
	// Check for JWT token in cookies
	// Adjust cookie name based on your implementation
	const token = request.cookies.get('auth_token')?.value ||
		request.cookies.get('token')?.value ||
		request.cookies.get('jwt')?.value

	// If token exists, consider user authenticated
	// For production, you should validate the token signature/expiry
	// This is a basic check - enhance based on your needs
	return !!token
}

/**
 * Next.js Middleware
 * Runs on every request before the page is rendered
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Allow public routes
	if (isPublicRoute(pathname)) {
		// If user is already authenticated and tries to access login, redirect to dashboard
		if (pathname === '/login' && isAuthenticated(request)) {
			return NextResponse.redirect(new URL('/', request.url))
		}
		return NextResponse.next()
	}

	// Protect all other routes
	if (!isAuthenticated(request)) {
		// Redirect to login with the original URL as a query parameter
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
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}

