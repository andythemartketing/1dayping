# Roude - Email Course Platform

Email course delivery platform with seamless subscription management.

## Business Rules

### Free Trial (Emails 1-6)
- First 6 emails are completely free
- No payment information required
- No mention of subscription or payment
- One email sent per day

### Subscription Prompt (Email 7)
- 7th email is the ONLY email that mentions subscription
- Contains call-to-action with Stripe payment link
- User must subscribe to continue receiving emails
- No emails sent after 7th until subscription is active

### Post-Subscription (Email 8+)
- Daily emails resume after successful payment
- Emails continue indefinitely while subscription is active
- User can manage subscription (cancel/pause) in dashboard

### Subscription Management
- Cancel/pause available in user dashboard
- No subscription management links in emails
- Magic link authentication (passwordless)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Stripe
- **Email**: SendGrid
- **Auth**: Magic link (email-based, no passwords)

## Project Structure

```
roude/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities and services
├── prisma/
│   └── schema.prisma     # Database schema
├── docs/                 # Documentation
└── public/               # Static assets
```

## Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `emailsSent`: Count of emails sent (0-7 for trial, 8+ for paid)
- `hasSubscribed`: Boolean flag for subscription status
- `subscriptionId`: Stripe subscription ID
- `stripeCustomerId`: Stripe customer ID
- `lastEmailSentAt`: Timestamp of last email
- `nextEmailAt`: Scheduled time for next email
- `isCancelled`: Cancellation flag

### MagicLink
- Authentication tokens for passwordless login
- Token expiration tracking

### EmailLog
- Audit trail of all sent emails
- Email number and status tracking

## Getting Started

See [SETUP.md](./SETUP.md) for local development setup.
