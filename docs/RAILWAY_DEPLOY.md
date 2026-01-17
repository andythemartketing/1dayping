# Railway Deployment Guide

## Prerequisites

1. Railway account: https://railway.app
2. GitHub repository with your code
3. All required API keys (Stripe, SendGrid)

## Step 1: Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Next.js and configure build settings

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a database and set `DATABASE_URL` automatically

## Step 3: Configure Environment Variables

In Railway project settings, add these variables:

```bash
# App Configuration
NEXTAUTH_SECRET=<generate-random-32-char-string>
NEXTAUTH_URL=https://your-app.railway.app

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# SendGrid
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@yourdomain.com

# Cron (for production security)
CRON_SECRET=<generate-random-string>

# Database (auto-set by Railway PostgreSQL)
# DATABASE_URL=postgresql://... (already set)
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Step 4: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.railway.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy webhook secret and add to Railway as `STRIPE_WEBHOOK_SECRET`

## Step 5: Deploy

Railway will automatically deploy when you push to main branch.

To manually deploy:
1. Go to your Railway project
2. Click "Deploy" → "Trigger Deploy"

## Step 6: Setup Cron Job (Daily Emails)

### Option A: Railway Cron (Recommended)

1. In Railway project, go to your service
2. Click "Settings" → "Cron"
3. Add schedule: `0 10 * * *` (10 AM UTC daily)
4. Command: `curl -X POST https://your-app.railway.app/api/cron/send-daily-emails -H "Authorization: Bearer $CRON_SECRET"`

### Option B: External Cron Service

Use services like:
- **cron-job.org** (free)
- **EasyCron** (free tier available)
- **GitHub Actions** (see example below)

**GitHub Actions Example:**

Create `.github/workflows/daily-emails.yml`:

```yaml
name: Daily Email Delivery

on:
  schedule:
    - cron: '0 10 * * *'  # 10 AM UTC daily
  workflow_dispatch:  # Allow manual trigger

jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger email sending
        run: |
          curl -X POST https://your-app.railway.app/api/cron/send-daily-emails \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Add `CRON_SECRET` to GitHub repository secrets.

## Step 7: Verify Deployment

1. Visit your app URL: `https://your-app.railway.app`
2. Test authentication with magic link
3. Test subscription flow
4. Check logs in Railway dashboard

## Monitoring

### View Logs

Railway Dashboard → Your Service → Deployments → View Logs

### Database Access

Railway Dashboard → PostgreSQL → Connect → Use provided connection string

Or use Prisma Studio locally:
```bash
# Set DATABASE_URL to Railway PostgreSQL URL
npx prisma studio
```

## Custom Domain (Optional)

1. Railway Dashboard → Your Service → Settings → Domains
2. Click "Add Domain"
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable

## Troubleshooting

### Build Fails

Check Railway logs. Common issues:
- Missing dependencies: `npm install` should include all deps
- Prisma not generated: Build command includes `npx prisma generate`

### Migration Fails

Railway runs `prisma migrate deploy` on startup. Check:
- Database connection (DATABASE_URL)
- Migration files in `prisma/migrations/`

### Emails Not Sending

Check:
- SendGrid API key is valid
- `FROM_EMAIL` matches verified sender in SendGrid
- Check Railway logs for email errors

### Cron Not Running

- Verify cron schedule format
- Check `CRON_SECRET` matches in both cron service and Railway
- Test manually: `curl -X POST https://your-app.railway.app/api/cron/send-daily-emails -H "Authorization: Bearer YOUR_CRON_SECRET"`

## Cost Estimation

Railway Pricing (as of 2024):
- **Hobby Plan**: $5/month
  - 500 hours execution time
  - $5 usage credit included
- **Pro Plan**: $20/month
  - Unlimited execution time
  - Team features

PostgreSQL Database:
- Included in Hobby/Pro plans
- Scales automatically

Estimated monthly cost: **$5-10** for small-medium traffic

## Rollback

If deployment has issues:
1. Railway Dashboard → Deployments
2. Click on previous working deployment
3. Click "Redeploy"

## Local Development vs Production

| Feature | Local | Production (Railway) |
|---------|-------|---------------------|
| Database | SQLite | PostgreSQL |
| Email | SendGrid (test mode) | SendGrid (production) |
| Payments | Stripe test mode | Stripe live mode |
| Domain | localhost:3000 | custom domain |
| Cron | Manual testing | Automated daily |

## Next Steps

- [ ] Deploy to Railway
- [ ] Configure all environment variables
- [ ] Setup Stripe webhook
- [ ] Test end-to-end flow
- [ ] Setup cron job for daily emails
- [ ] Configure custom domain (optional)
- [ ] Monitor logs and performance

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: GitHub repository
