'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Goal {
  id: string
  category: string
  goalText: string
  stage: string
}

const CATEGORIES = [
  { value: 'Health', emoji: '💪', label: 'Health & Fitness' },
  { value: 'Relationships', emoji: '❤️', label: 'Relationships' },
  { value: 'Career', emoji: '💼', label: 'Career' },
  { value: 'Money', emoji: '💰', label: 'Money & Finance' },
  { value: 'Business', emoji: '🚀', label: 'Business' },
  { value: 'Learning', emoji: '📚', label: 'Learning' },
  { value: 'Productivity', emoji: '⚡', label: 'Productivity' },
  { value: 'Creativity', emoji: '🎨', label: 'Creativity' },
]

const STAGES = [
  { value: 'Just started', label: 'Just Started', description: "I'm new to this" },
  { value: 'Intermediate', label: 'Intermediate', description: 'I have some experience' },
  { value: 'Advanced', label: 'Advanced', description: 'I want to master this' },
]

export default function GoalEditForm({ goal }: { goal: Goal }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    category: goal.category,
    goalText: goal.goalText,
    stage: goal.stage,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/goals/${goal.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update goal')
      }

      router.push(`/dashboard/goals/${goal.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Goal Category
        </label>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat.value })}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.category === cat.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="font-medium text-sm">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Goal Text */}
      <div>
        <label htmlFor="goalText" className="block text-sm font-medium text-gray-700 mb-2">
          Describe your goal
        </label>
        <textarea
          id="goalText"
          value={formData.goalText}
          onChange={(e) => setFormData({ ...formData, goalText: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          rows={4}
          maxLength={200}
          placeholder="e.g., Run a marathon in under 4 hours"
          required
        />
        <p className="text-sm text-gray-500 mt-1">{formData.goalText.length}/200 characters</p>
      </div>

      {/* Stage Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Experience Level
        </label>
        <div className="space-y-3">
          {STAGES.map((stg) => (
            <button
              key={stg.value}
              type="button"
              onClick={() => setFormData({ ...formData, stage: stg.value })}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.stage === stg.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{stg.label}</div>
              <div className="text-sm text-gray-600">{stg.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || !formData.goalText.trim()}
          className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Note: Editing your goal will not regenerate the email course
      </p>
    </form>
  )
}
