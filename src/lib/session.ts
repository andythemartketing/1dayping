import { cookies } from 'next/headers'
import { getUserById } from './auth'

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return null
  }

  const userId = sessionCookie.value
  const user = await getUserById(userId)

  return user
}

export async function requireSession() {
  const user = await getSession()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
