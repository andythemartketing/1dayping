'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GoalActionsProps {
  goalId: string
  isCompleted: boolean
  isCancelled: boolean
}

export default function GoalActions({ goalId, isCompleted, isCancelled }: GoalActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState<'complete' | 'cancel' | null>(null)

  const handleAction = async (action: 'complete' | 'cancel') => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/goals/${goalId}/${action}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} goal`)
      }

      router.refresh()
      setShowConfirm(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : `Failed to ${action} goal`)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCompleted || isCancelled) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm('complete')}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        disabled={isLoading}
      >
        Mark Complete
      </button>
      <button
        onClick={() => setShowConfirm('cancel')}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        disabled={isLoading}
      >
        Cancel Goal
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">
              {showConfirm === 'complete' ? 'Mark Goal as Complete?' : 'Cancel This Goal?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {showConfirm === 'complete'
                ? 'This will mark your goal as completed. You can still view your email history.'
                : 'This will stop all future emails for this goal. This action cannot be undone.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(showConfirm)}
                className={`px-4 py-2 text-white rounded transition-colors ${
                  showConfirm === 'complete'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
