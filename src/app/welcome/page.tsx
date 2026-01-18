export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
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

          <h1 className="text-4xl font-bold text-gray-900">Check your email</h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            We've sent you a magic link to continue setting up your goal.
            <br />
            Click the link in the email to get started.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left space-y-4">
          <h2 className="font-semibold text-gray-900">What happens next:</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span>Click the link in your email</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span>Choose your goal category and experience level</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span>Start receiving one daily email</span>
            </li>
          </ol>
        </div>

        <p className="text-sm text-gray-500">
          Didn't receive an email? Check your spam folder or{' '}
          <a href="/" className="text-gray-900 underline hover:no-underline">
            try again
          </a>
          .
        </p>
      </div>
    </main>
  )
}
