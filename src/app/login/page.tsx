'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Check your email for the magic link!')
        setEmail('')
      } else {
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setMessage('Failed to send magic link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Roude</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error === 'invalid_token' && 'Invalid or expired magic link'}
              {error === 'missing_token' && 'Magic link token is missing'}
              {error === 'server_error' && 'Server error, please try again'}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            We'll send you a magic link to sign in without a password
          </p>
        </div>
      </div>
    </main>
  )
}
