import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Emails Sent</p>
              <p className="font-medium">{user.emailsSent} of ∞</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Subscription Status</p>
              <p className="font-medium">
                {user.emailsSent < 7 ? (
                  <span className="text-green-600">Free Trial ({6 - user.emailsSent} free emails remaining)</span>
                ) : user.hasSubscribed ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-amber-600">Trial Ended - Subscribe to Continue</span>
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
                  No more emails will be sent
                </p>
              </div>
            )}
          </div>

          {user.hasSubscribed && !user.isCancelled && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Subscription Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your subscription settings
              </p>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={() => alert('Cancel functionality coming soon')}
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
