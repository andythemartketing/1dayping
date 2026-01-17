'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to cancel subscription')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Cancel error:', error)
      alert('Failed to cancel subscription')
      setIsLoading(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-700">
          Are you sure you want to cancel? You'll stop receiving daily emails.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm disabled:opacity-50"
          >
            {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
          >
            Keep Subscription
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
    >
      Cancel Subscription
    </button>
  )
}
