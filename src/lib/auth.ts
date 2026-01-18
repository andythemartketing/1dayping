import { randomBytes } from 'crypto'
import { prisma } from './prisma'

const MAGIC_LINK_EXPIRY_MINUTES = 15

export async function generateMagicLink(email: string): Promise<string> {
  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
      },
    })
  }

  // Generate token
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000)

  // Clean up old tokens for this user
  await prisma.magicLink.deleteMany({
    where: { userId: user.id },
  })

  // Create new magic link
  await prisma.magicLink.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })

  // Build magic link URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/api/auth/verify?token=${token}`
}

export async function verifyMagicLink(token: string): Promise<string | null> {
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!magicLink) {
    return null
  }

  // Check expiry
  if (magicLink.expiresAt < new Date()) {
    await prisma.magicLink.delete({ where: { token } })
    return null
  }

  // Delete used token
  await prisma.magicLink.delete({ where: { token } })

  return magicLink.user.id
}

export async function createSession(userId: string): Promise<string> {
  // Create session token
  const sessionToken = randomBytes(32).toString('hex')

  // In production, store this in a session table or use JWT
  // For now, we'll use a simple token that we can verify
  return sessionToken
}

export async function getUserFromEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  })
}
