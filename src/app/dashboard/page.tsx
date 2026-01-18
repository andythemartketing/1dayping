import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import LogoutButton from '@/components/LogoutButton'
import SubscribeButton from '@/components/SubscribeButton'
import CancelButton from '@/components/CancelButton'
import Link from 'next/link'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const user = await getSession()
  const params = await searchParams

  if (!user) {
    redirect('/login')
  }

  // Fetch user's goals with email plan data
  const goals = await prisma.goal.findMany({
    where: { userId: user.id },
    include: {
      emailPlan: {
        include: {
          emails: {
            orderBy: { dayNumber: 'asc' },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate total emails sent across all goals
  const totalEmailsSent = goals.reduce((total, goal) => {
    const sentEmails = goal.emailPlan?.emails.filter((e) => e.sentAt !== null).length || 0
    return total + sentEmails
  }, 0)

  const showSuccess = params.success === 'true'
  const showCanceled = params.canceled === 'true'

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">1dayping</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/settings"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Settings
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              Subscription activated! Your daily emails will resume tomorrow.
            </p>
          </div>
        )}

        {showCanceled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Checkout was cancelled. You can subscribe anytime from this dashboard.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Overview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-bold mb-4">Account Overview</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-sm break-words">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Emails Received</p>
                  <p className="font-medium">{totalEmailsSent}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Subscription Status</p>
                  <p className="font-medium">
                    {totalEmailsSent < 7 ? (
                      <span className="text-green-600">
                        Free Trial ({7 - totalEmailsSent} emails remaining)
                      </span>
                    ) : user.hasSubscribed ? (
                      <span className="text-green-600">Active Subscriber</span>
                    ) : (
                      <span className="text-amber-600">Trial Ended</span>
                    )}
                  </p>
                </div>

                {user.hasSubscribed && user.subscribedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Subscriber Since</p>
                    <p className="font-medium text-sm">
                      {new Date(user.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Subscription CTA for users who finished trial but haven't subscribed */}
              {totalEmailsSent >= 7 && !user.hasSubscribed && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-semibold mb-2">Continue Your Journey</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You've completed the free trial. Subscribe to continue receiving daily lessons.
                  </p>
                  <SubscribeButton />
                </div>
              )}

              {/* Subscription management for active subscribers */}
              {user.hasSubscribed && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-semibold mb-3">Subscription</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Cancel your subscription anytime. You'll stop receiving daily emails.
                  </p>
                  <CancelButton />
                </div>
              )}

              {/* Info for active trial users */}
              {totalEmailsSent < 7 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-semibold mb-2">Your Free Trial</h3>
                  <p className="text-xs text-gray-600">
                    You're receiving free daily emails. After email 7, you'll be prompted to subscribe.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area - Goals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Goals</h2>
                {user.onboardingComplete && (
                  <Link
                    href="/onboarding"
                    className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
                  >
                    + New Goal
                  </Link>
                )}
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't created any goals yet.</p>
                  <Link
                    href="/onboarding"
                    className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Create Your First Goal
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => {
                    const emailsSent = goal.emailPlan?.emails.filter((e) => e.sentAt !== null).length || 0
                    const totalEmails = goal.emailPlan?.emails.length || 14
                    const progress = (emailsSent / totalEmails) * 100
                    const nextEmail = goal.emailPlan?.emails.find((e) => e.sentAt === null)
                    const isCompleted = !!goal.completedAt
                    const isCancelled = !!goal.cancelledAt

                    return (
                      <div
                        key={goal.id}
                        className={`border rounded-lg p-5 ${
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : isCancelled
                            ? 'bg-gray-50 border-gray-300'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{getCategoryEmoji(goal.category)}</span>
                              <h3 className="font-semibold text-lg">{goal.goalText}</h3>
                            </div>
                            <div className="flex gap-2 text-sm text-gray-600">
                              <span className="px-2 py-1 bg-gray-100 rounded">{goal.category}</span>
                              <span className="px-2 py-1 bg-gray-100 rounded">{goal.stage}</span>
                            </div>
                          </div>
                          {isCompleted && (
                            <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                              Completed
                            </span>
                          )}
                          {isCancelled && (
                            <span className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                              Cancelled
                            </span>
                          )}
                          {!isCompleted && !isCancelled && goal.isActive && (
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                              Active
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>
                              {emailsSent} / {totalEmails} emails
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCompleted
                                  ? 'bg-green-600'
                                  : isCancelled
                                  ? 'bg-gray-400'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {nextEmail && !isCancelled && !isCompleted && (
                          <p className="text-sm text-gray-600 mb-3">
                            Next email: <span className="font-medium">{nextEmail.subject}</span>
                          </p>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/dashboard/goals/${goal.id}`}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                          >
                            View Details
                          </Link>
                          {!isCompleted && !isCancelled && (
                            <Link
                              href={`/dashboard/goals/${goal.id}/edit`}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
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
