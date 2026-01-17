import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import SubscribeButton from '@/components/SubscribeButton'
import CancelButton from '@/components/CancelButton'

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

  const showSuccess = params.success === 'true'
  const showCanceled = params.canceled === 'true'

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">Roude</h1>
            <LogoutButton />
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Emails Received</p>
              <p className="font-medium">{user.emailsSent} emails</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Subscription Status</p>
              <p className="font-medium">
                {user.emailsSent < 7 ? (
                  <span className="text-green-600">
                    Free Trial ({6 - user.emailsSent} emails remaining)
                  </span>
                ) : user.hasSubscribed ? (
                  <span className="text-green-600">Active Subscriber</span>
                ) : (
                  <span className="text-amber-600">Trial Ended</span>
                )}
              </p>
            </div>

            {user.nextEmailAt && !user.isCancelled && (
              <div>
                <p className="text-sm text-gray-600">Next Email</p>
                <p className="font-medium">
                  {new Date(user.nextEmailAt).toLocaleDateString()} at{' '}
                  {new Date(user.nextEmailAt).toLocaleTimeString()}
                </p>
              </div>
            )}

            {user.isCancelled && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 font-medium">Subscription Cancelled</p>
                <p className="text-sm text-red-600 mt-1">
                  No more emails will be sent.
                </p>
              </div>
            )}
          </div>

          {/* Subscription CTA for users who finished trial but haven't subscribed */}
          {user.emailsSent >= 7 && !user.hasSubscribed && !user.isCancelled && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Continue Your Journey</h3>
              <p className="text-gray-600 mb-4">
                You've completed the free trial. Subscribe to continue receiving daily lessons.
              </p>
              <SubscribeButton />
            </div>
          )}

          {/* Subscription management for active subscribers */}
          {user.hasSubscribed && !user.isCancelled && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Subscription Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Cancel your subscription anytime. You'll stop receiving daily emails.
              </p>
              <CancelButton />
            </div>
          )}

          {/* Info for active trial users */}
          {user.emailsSent < 7 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Your Free Trial</h3>
              <p className="text-sm text-gray-600">
                You're receiving free daily emails. After email 6, you'll receive a special offer to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
