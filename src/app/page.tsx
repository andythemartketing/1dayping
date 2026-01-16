import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold mb-4">Roude</h1>
        <p className="text-xl text-gray-600 mb-8">
          Daily email courses delivered to your inbox
        </p>
        <p className="text-gray-500 mb-8">
          Start your learning journey with 6 free emails. Subscribe to continue after your trial.
        </p>
        <Link
          href="/login"
          className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </main>
  )
}
