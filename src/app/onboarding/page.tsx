'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { id: 'Health', label: 'Health', emoji: '💪' },
  { id: 'Relationships', label: 'Relationships', emoji: '❤️' },
  { id: 'Career', label: 'Career', emoji: '💼' },
  { id: 'Money', label: 'Money', emoji: '💰' },
  { id: 'Business', label: 'Business', emoji: '🚀' },
  { id: 'Learning', label: 'Learning', emoji: '📚' },
  { id: 'Productivity', label: 'Productivity', emoji: '⚡' },
  { id: 'Creativity', label: 'Creativity', emoji: '🎨' },
]

const STAGES = [
  { id: 'Just started', label: 'Beginner', description: "I'm new to this" },
  { id: 'Intermediate', label: 'Intermediate', description: 'I have some experience' },
  { id: 'Advanced', label: 'Advanced', description: 'I want to master this' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [goal, setGoal] = useState('')
  const [stage, setStage] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!category || !goal || !stage || !email) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, goal, stage, email }),
      })

      if (!res.ok) {
        throw new Error('Failed to create goal')
      }

      router.push('/success')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of 4
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Category */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Choose a category
            </h2>
            <p className="text-gray-600 mb-6">
              Pick the area you want to focus on right now.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    category === cat.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="font-medium text-gray-900">{cat.label}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!category}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What do you want to achieve?
            </h2>
            <p className="text-gray-600 mb-6">
              Write it in one sentence. Be specific if you can.
            </p>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Learn to play guitar, Write a book, Get fit..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none resize-none"
              rows={4}
              maxLength={200}
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {goal.length}/200
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={goal.length < 5}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Stage */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Where are you right now?
            </h2>
            <p className="text-gray-600 mb-6">
              This helps us adjust the content to your experience level.
            </p>

            <div className="space-y-3">
              {STAGES.map((stg) => (
                <button
                  key={stg.id}
                  onClick={() => setStage(stg.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    stage === stg.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {stg.label}
                  </div>
                  <div className="text-sm text-gray-600">{stg.description}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!stage}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Email */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Where should we send your daily messages?
            </h2>
            <p className="text-gray-600 mb-6">
              You'll receive one email per day to keep you connected to your goal.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!email || loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Start my daily emails'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
