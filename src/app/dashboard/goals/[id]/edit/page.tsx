import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import GoalEditForm from '@/components/GoalEditForm'

export default async function GoalEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSession()
  const { id } = await params

  if (!user) {
    redirect('/login')
  }

  // Fetch goal
  const goal = await prisma.goal.findUnique({
    where: { id, userId: user.id },
  })

  if (!goal) {
    notFound()
  }

  // Don't allow editing completed or cancelled goals
  if (goal.completedAt || goal.cancelledAt) {
    redirect(`/dashboard/goals/${id}`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href={`/dashboard/goals/${id}`} className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Goal
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Goal</h1>
          <GoalEditForm goal={goal} />
        </div>
      </div>
    </main>
  )
}
