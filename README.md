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

## Documentation

- [Project Overview](./docs/README.md)
- [Setup Guide](./docs/SETUP.md)

## Business Logic

- **Emails 1-6**: Free trial, no payment required
- **Email 7**: Single subscription prompt with payment
- **Email 8+**: Daily emails for active subscribers
- **Management**: Cancel/pause in user dashboard

## Tech Stack

Next.js 14 + TypeScript + PostgreSQL + Prisma + Stripe + SendGrid
