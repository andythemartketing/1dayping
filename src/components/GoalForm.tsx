'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GoalForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    goal: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Create user and send to onboarding with pre-filled goal
      const response = await fetch('/api/quick-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setMessage({
        type: 'success',
        text: 'Perfect! Check your email for the next step.',
      })

      // Optionally redirect to a thank you page
      setTimeout(() => {
        router.push('/welcome')
      }, 2000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to start. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {message && (
        <div
          className={`p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          What's your goal?
        </label>
        <textarea
          id="goal"
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          placeholder="e.g., Learn to play guitar, Write a book, Get fit..."
          required
          maxLength={200}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">{formData.goal.length}/200</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Your email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.email || !formData.goal}
        className="w-full px-8 py-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Starting...' : 'Start my daily emails'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        No credit card. No commitment. Unsubscribe anytime.
      </p>
    </form>
  )
}
