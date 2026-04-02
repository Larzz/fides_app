'use client'

import { useState } from 'react'

interface FileNotifyToggleProps {
	fileId: number
	initialOn: boolean
}

export function FileNotifyToggle({ fileId, initialOn }: FileNotifyToggleProps) {
	const [on, setOn] = useState(initialOn)
	const [busy, setBusy] = useState(false)

	async function handleClick() {
		if (!fileId || busy) {
			return
		}
		const next = !on
		setBusy(true)
		try {
			const res = await fetch(`/api/files/${fileId}/notify`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ notify_stakeholders: next }),
			})
			if (res.ok) {
				setOn(next)
			}
		} finally {
			setBusy(false)
		}
	}

	return (
		<button
			type="button"
			role="switch"
			aria-checked={on}
			disabled={busy || !fileId}
			onClick={handleClick}
			className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 ${
				on ? 'bg-orange-500' : 'bg-gray-200'
			}`}
		>
			<span
				className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
					on ? 'translate-x-5' : 'translate-x-0.5'
				}`}
			/>
		</button>
	)
}
