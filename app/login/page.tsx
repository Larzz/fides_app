'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { setAuthToken } from '@/lib/auth'

function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [showPassword, setShowPassword] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			// TODO: Replace with your actual API endpoint
			// Example: const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.message || 'Login failed')
			}

			const data = await response.json()
			
			// Store the token in cookies
			if (data.token) {
				setAuthToken(data.token, rememberMe)
			}

			// Redirect to the original page or dashboard
			const redirect = searchParams.get('redirect') || '/'
			router.push(redirect)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen relative flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/background.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Logo */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/logo.png"
                            alt="Creativ Logo"
                            width={120}
                            height={40}
                            className="h-auto"
                            priority
                        />
                        {/* <span className="text-white text-2xl font-bold">Creativ</span> */}
                    </div>
                </div>

                {/* Login Form */}
                <div className="relative z-10 w-full max-w-md mx-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                        {/* Welcome Message */}
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                            Welcome <span className="inline-block">👋</span>
                        </h2>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3l18 18"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg uppercase tracking-wide transition-colors duration-200"
                            >
                                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                            </button>

                            {/* Forgot Password */}
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-orange-500 hover:text-orange-600 font-semibold text-sm uppercase tracking-wide"
                                >
                                    FORGOT PASSWORD?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Elements */}
                {/* Help Icon - Bottom Left */}
                <div className="absolute bottom-6 left-6 z-10">
                    <button
                        type="button"
                        className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors"
                        aria-label="Help"
                    >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                        </div>
                    </button>
                </div>

			{/* Support Info - Bottom Right */}
			<div className="absolute bottom-6 right-6 z-10 max-w-xs">
				<div className="bg-orange-100 rounded-lg p-4 shadow-lg">
					<p className="text-sm text-gray-800 mb-1">
						Need help accessing your account?{' '}
						<Link
							href="/support"
							className="font-bold text-gray-900 hover:underline"
						>
							Contact support.
						</Link>
					</p>
					<p className="text-xs text-gray-700">
						Secure access. Your data is protected.
					</p>
				</div>
			</div>
		</div>
	)
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen relative flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 z-0">
					<Image
						src="/assets/background.png"
						alt="Background"
						fill
						className="object-cover"
						priority
					/>
				</div>
				<div className="relative z-10">
					<div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
						<div className="animate-pulse">
							<div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
							<div className="h-10 bg-gray-200 rounded mb-4"></div>
							<div className="h-10 bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		}>
			<LoginForm />
		</Suspense>
	)
}

