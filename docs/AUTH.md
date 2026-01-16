# Authentication System

## Magic Link Authentication

Roude uses passwordless authentication via magic links sent to email.

## Flow

1. User enters email on `/login` page
2. System sends magic link to email via SendGrid
3. User clicks link in email
4. Token is verified and session is created
5. User is redirected to `/dashboard`

## API Endpoints

### POST `/api/auth/send-link`

Generates and sends magic link to user's email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link sent to your email"
}
```

### GET `/api/auth/verify?token=xxx`

Verifies magic link token and creates session.

**Query Parameters:**
- `token`: Magic link token

**Response:**
- Redirect to `/dashboard` on success
- Redirect to `/login?error=invalid_token` on failure

### POST `/api/auth/logout`

Clears session cookie.

**Response:**
```json
{
  "success": true
}
```

## Session Management

Sessions are stored in HTTP-only cookies for security:
- Cookie name: `session`
- Value: User ID
- Max age: 30 days
- HTTP-only: true
- Secure: true (in production)
- SameSite: lax

## Middleware

`src/middleware.ts` protects routes:
- Public routes: `/`, `/login`
- Protected routes: Everything else (requires session)
- Auto-redirect: `/login` → `/dashboard` if logged in

## Magic Link Security

- Tokens are 32-byte random hex strings
- Expiry: 15 minutes
- One-time use: Token deleted after verification
- Old tokens cleaned up when new link is requested

## Database Schema

### MagicLink Table
```prisma
model MagicLink {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(...)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## Email Configuration

Magic link emails are sent via SendGrid. Template includes:
- Clear call-to-action button
- Expiry notice (15 minutes)
- Plain text fallback
- Sender: `FROM_EMAIL` env variable

## Usage in Code

### Check Session
```typescript
import { getSession } from '@/lib/session'

const user = await getSession()
if (!user) {
  // Not logged in
}
```

### Require Session
```typescript
import { requireSession } from '@/lib/session'

const user = await requireSession() // Throws if no session
```

### Send Magic Link
```typescript
import { generateMagicLink } from '@/lib/auth'
import { sendMagicLinkEmail } from '@/lib/email'

const magicLink = await generateMagicLink(email)
await sendMagicLinkEmail(email, magicLink)
```
