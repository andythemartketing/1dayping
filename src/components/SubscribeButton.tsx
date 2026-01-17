'use client'

import { useState } from 'react'

export default function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to create checkout session')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      alert('Failed to start checkout')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    >
      {isLoading ? 'Loading...' : 'Subscribe Now'}
    </button>
  )
}
