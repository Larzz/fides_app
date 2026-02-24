'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		// Handle forgot password logic here
		console.log('Password reset request:', { email })
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
					<span className="text-white text-2xl font-bold">Creativ</span>
				</div>
			</div>

			{/* Forgot Password Form */}
			<div className="relative z-10 w-full max-w-md mx-4">
				<div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
					{/* Title */}
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Forgot Password
					</h2>

					{/* Description */}
					<p className="text-gray-700 mb-8">
						Enter your email address and we'll send you a password reset link.
					</p>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
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
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								placeholder="Email Address"
							/>
						</div>

						{/* Send Reset Link Button */}
						<button
							type="submit"
							className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg uppercase tracking-wide transition-colors duration-200"
						>
							SEND RESET LINK
						</button>

						{/* Back to Sign In */}
						<div className="text-center">
							<Link
								href="/login"
								className="text-orange-500 hover:text-orange-600 font-semibold text-sm uppercase tracking-wide"
							>
								BACK TO SIGN IN
							</Link>
						</div>
					</form>
				</div>
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

