'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ResetPasswordPage() {
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (newPassword !== confirmPassword) {
			alert('Passwords do not match')
			return
		}
		// Handle reset password logic here
		console.log('Password reset:', { newPassword })
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

			{/* Reset Password Form */}
			<div className="relative z-10 w-full max-w-md mx-4">
				<div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
					{/* Title */}
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
						Reset Password
					</h2>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* New Password Field */}
						<div>
							<label
								htmlFor="new-password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								New Password
							</label>
							<div className="relative">
								<input
									id="new-password"
									type={showNewPassword ? 'text' : 'password'}
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
									placeholder="Create a new password"
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
									aria-label={
										showNewPassword ? 'Hide password' : 'Show password'
									}
								>
									{showNewPassword ? (
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

						{/* Confirm Password Field */}
						<div>
							<label
								htmlFor="confirm-password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Confirm Password
							</label>
							<div className="relative">
								<input
									id="confirm-password"
									type={showConfirmPassword ? 'text' : 'password'}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
									placeholder="Re-enter new password"
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(!showConfirmPassword)
									}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
									aria-label={
										showConfirmPassword ? 'Hide password' : 'Show password'
									}
								>
									{showConfirmPassword ? (
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

						{/* Reset Password Button */}
						<button
							type="submit"
							className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg uppercase tracking-wide transition-colors duration-200"
						>
							RESET PASSWORD
						</button>
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
							className="font-bold text-orange-500 hover:underline"
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

