export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Success</h1>

        <p className="text-lg text-gray-700 mb-8">
          Your daily emails will begin shortly.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4 mb-8">
          <h2 className="font-semibold text-gray-900">What happens next:</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                1
              </span>
              <span>We're creating your personalized 14-day email course</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                2
              </span>
              <span>You'll receive your first email tomorrow</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                3
              </span>
              <span>One short email will arrive each day to keep you connected to your goal</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Check your inbox tomorrow for your first daily reminder.
          <br />
          You can unsubscribe anytime with one click.
        </p>

        <a
          href="/"
          className="inline-block text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to home
        </a>
      </div>
    </div>
  )
}
