# Roude

Email course delivery platform with seamless subscription management.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Run development server
npm run dev
```

Visit http://localhost:3000

**Note:** App runs with SQLite by default. Works immediately without PostgreSQL installation.

## Documentation

- [Quick Start Guide](./docs/QUICK_START.md) - Get running in 5 minutes
- [Project Overview](./docs/README.md) - Architecture and business rules
- [Setup Guide](./docs/SETUP.md) - Full production setup
- [Railway Deployment](./docs/RAILWAY_DEPLOY.md) - **Deploy to production** 🚀
- [Authentication](./docs/AUTH.md) - Magic link implementation
- [Features](./docs/FEATURES.md) - Complete feature documentation
- [Testing](./docs/TESTING.md) - Testing and troubleshooting

## Business Logic

- **Emails 1-6**: Free trial, no payment required
- **Email 7**: Single subscription prompt with Stripe checkout
- **Email 8+**: Daily emails for active subscribers
- **Management**: Cancel/resume in user dashboard

## Features

✅ Passwordless authentication (magic links)
✅ Email course delivery (7 templates included)
✅ Stripe subscription integration
✅ Automated daily email scheduling
✅ Subscription management dashboard
✅ SQLite (dev) / PostgreSQL (prod) support
✅ SendGrid email delivery
✅ Webhook handling for payments

## Tech Stack

Next.js 14 + TypeScript + SQLite/PostgreSQL + Prisma + Stripe + SendGrid

## Project Status

✅ Authentication - Complete
✅ Email delivery - Complete
✅ Stripe integration - Complete
✅ Dashboard - Complete
✅ Documentation - Complete

Ready for production deployment!
