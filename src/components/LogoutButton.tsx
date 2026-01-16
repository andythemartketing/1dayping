'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
