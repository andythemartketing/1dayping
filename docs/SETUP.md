# Local Development Setup

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for testing)
- SendGrid account (for email testing)

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for session encryption
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for local)
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `SENDGRID_API_KEY`: SendGrid API key
- `FROM_EMAIL`: Verified sender email in SendGrid

3. **Setup database**

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

4. **Configure Stripe**

- Create a product in Stripe Dashboard
- Create a recurring price (daily/monthly)
- Setup webhook endpoint: `http://localhost:3000/api/webhooks/stripe`
- Add webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

5. **Configure SendGrid (or Gmail SMTP)**

**Option A: SendGrid (Recommended)**
- Verify sender email address
- Create API key with full access
- Add `SENDGRID_API_KEY` and `FROM_EMAIL` to `.env`

**Option B: Gmail via SendGrid**
- Use your Gmail as `FROM_EMAIL`
- SendGrid will send from your domain but you'll need verified sender
- For development, SendGrid free tier works well

**Note:** Direct Gmail SMTP integration requires additional setup. SendGrid is recommended for production.

## Running Locally

```bash
npm run dev
```

App will be available at http://localhost:3000

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Testing Stripe Webhooks Locally

Use Stripe CLI to forward webhooks to localhost:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Email Scheduling

Daily emails are sent via cron job or scheduled task. For local testing, you can manually trigger the email job:

```bash
curl http://localhost:3000/api/cron/send-emails
```

Or set up a cron job to hit this endpoint daily.
