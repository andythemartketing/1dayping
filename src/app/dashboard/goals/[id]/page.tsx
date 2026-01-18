import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import GoalActions from '@/components/GoalActions'

export default async function GoalDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSession()
  const { id } = await params

  if (!user) {
    redirect('/login')
  }

  // Fetch goal with email plan
  const goal = await prisma.goal.findUnique({
    where: { id, userId: user.id },
    include: {
      emailPlan: {
        include: {
          emails: {
            orderBy: { dayNumber: 'asc' },
          },
        },
      },
    },
  })

  if (!goal) {
    notFound()
  }

  const emailsSent = goal.emailPlan?.emails.filter((e) => e.sentAt !== null).length || 0
  const totalEmails = goal.emailPlan?.emails.length || 14
  const progress = (emailsSent / totalEmails) * 100
  const isCompleted = !!goal.completedAt
  const isCancelled = !!goal.cancelledAt

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goal Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{getCategoryEmoji(goal.category)}</span>
                <h1 className="text-3xl font-bold">{goal.goalText}</h1>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="px-3 py-1 bg-gray-100 rounded">{goal.category}</span>
                <span className="px-3 py-1 bg-gray-100 rounded">{goal.stage}</span>
                {isCompleted && (
                  <span className="px-3 py-1 bg-green-600 text-white rounded">Completed</span>
                )}
                {isCancelled && (
                  <span className="px-3 py-1 bg-gray-500 text-white rounded">Cancelled</span>
                )}
                {!isCompleted && !isCancelled && (
                  <span className="px-3 py-1 bg-blue-600 text-white rounded">Active</span>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Email Progress</span>
              <span>
                {emailsSent} / {totalEmails} sent ({Math.round(progress)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  isCompleted ? 'bg-green-600' : isCancelled ? 'bg-gray-400' : 'bg-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-6 border-b">
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium">{new Date(goal.createdAt).toLocaleDateString()}</p>
            </div>
            {isCompleted && goal.completedAt && (
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="font-medium">{new Date(goal.completedAt).toLocaleDateString()}</p>
              </div>
            )}
            {isCancelled && goal.cancelledAt && (
              <div>
                <p className="text-gray-600">Cancelled</p>
                <p className="font-medium">{new Date(goal.cancelledAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!isCompleted && !isCancelled && (
              <Link
                href={`/dashboard/goals/${goal.id}/edit`}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Edit Goal
              </Link>
            )}
            <GoalActions goalId={goal.id} isCompleted={isCompleted} isCancelled={isCancelled} />
          </div>
        </div>

        {/* Email Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Email Timeline</h2>

          {goal.emailPlan?.emails && goal.emailPlan.emails.length > 0 ? (
            <div className="space-y-3">
              {goal.emailPlan.emails.map((email) => {
                const isSent = !!email.sentAt
                const today = new Date()
                const sentDate = email.sentAt ? new Date(email.sentAt) : null

                return (
                  <div
                    key={email.id}
                    className={`border rounded-lg p-4 ${
                      isSent ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSent ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isSent ? '✓' : email.dayNumber}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold">{email.subject}</h3>
                          {isSent && sentDate && (
                            <span className="text-xs text-gray-500">
                              {sentDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {isSent && user.hasSubscribed ? (
                          <details className="text-sm text-gray-700">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              View email content
                            </summary>
                            <div className="mt-2 p-3 bg-white border border-gray-200 rounded whitespace-pre-wrap">
                              {email.content}
                            </div>
                          </details>
                        ) : isSent && !user.hasSubscribed ? (
                          <p className="text-sm text-gray-500 italic">{email.preview}</p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Day {email.dayNumber} - Scheduled to send soon
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Email plan is being generated. Check back soon!
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    Health: '💪',
    Relationships: '❤️',
    Career: '💼',
    Money: '💰',
    Business: '🚀',
    Learning: '📚',
    Productivity: '⚡',
    Creativity: '🎨',
  }
  return emojiMap[category] || '🎯'
}
