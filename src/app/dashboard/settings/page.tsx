import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteAccountButton from '@/components/DeleteAccountButton'

export default async function SettingsPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <p className="text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  This is the email where you receive your daily lessons
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              {user.hasSubscribed && user.subscribedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Status
                  </label>
                  <p className="text-green-600 font-medium">Active Subscriber</p>
                  <p className="text-sm text-gray-600">
                    Since {new Date(user.subscribedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Subscription Management */}
          {user.hasSubscribed && user.stripeCustomerId && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Subscription Management</h2>
              <p className="text-sm text-gray-600 mb-4">
                Manage your subscription, update payment methods, or view billing history through
                Stripe's customer portal.
              </p>
              <a
                href={`/api/stripe/customer-portal?customerId=${user.stripeCustomerId}`}
                className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Manage Subscription
              </a>
            </div>
          )}

          {/* Email Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Email Preferences</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Daily Emails</h3>
                <p className="text-sm text-gray-600 mb-3">
                  You receive daily emails for each active goal. To stop receiving emails for a
                  specific goal, mark it as completed or cancelled from your dashboard.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Email Delivery Time</h3>
                <p className="text-sm text-gray-600">
                  Emails are sent once per day at a scheduled time. Currently, this is managed
                  automatically based on when you created your goals.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Privacy & Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Data Storage</h3>
                <p className="text-sm text-gray-600">
                  Your email address, goals, and email content are securely stored. We never share
                  your personal information with third parties.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Magic Link Authentication</h3>
                <p className="text-sm text-gray-600">
                  We use password-less authentication via magic links sent to your email. Each link
                  expires after 15 minutes for security.
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-lg border-2 border-red-200 p-6">
            <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-red-900 mb-1">Delete Account</h3>
                <p className="text-sm text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be
                  undone. All your goals, email history, and subscription information will be
                  deleted.
                </p>
                <DeleteAccountButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
