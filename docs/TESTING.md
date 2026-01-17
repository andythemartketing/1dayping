# Testing Guide

## Local Testing

### 1. Test Authentication

**Sign up:**
```bash
# Start server
npm run dev

# Open browser
open http://localhost:3000

# Click "Get Started"
# Enter email
# Check email for magic link
# Click link
# Should redirect to dashboard
```

**Without SendGrid configured:**
- Magic link will fail to send
- Check console logs for the generated link
- Manually visit the link to authenticate

### 2. Test Email Delivery

**Simulate daily emails:**

```bash
# Create test user in database
npm run prisma:studio

# Add user with nextEmailAt set to past date

# Trigger cron job manually
curl http://localhost:3000/api/cron/send-emails

# Check EmailLog table for sent emails
```

**Test all email states:**

1. Create user with `emailsSent: 0`
2. Run cron 7 times
3. Verify emails 1-6 have no payment mention
4. Verify email 7 has subscription link
5. Verify no email 8 sent without subscription

### 3. Test Stripe Subscription

**Setup test environment:**

1. Create Stripe test account
2. Add test keys to `.env`
3. Create product and price
4. Add `STRIPE_PRICE_ID` to `.env`

**Test checkout flow:**

```bash
# 1. Create user with emailsSent: 7
# 2. Login to dashboard
# 3. Click "Subscribe Now"
# 4. Should redirect to Stripe checkout
# 5. Use test card: 4242 4242 4242 4242
# 6. Complete payment
# 7. Should redirect to dashboard with success message
```

**Test webhook:**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Get webhook secret from output
# Add to .env as STRIPE_WEBHOOK_SECRET

# Test payment
# Webhook should process and activate subscription
```

### 4. Test Subscription Cancellation

```bash
# 1. Have active subscription
# 2. Go to dashboard
# 3. Click "Cancel Subscription"
# 4. Confirm cancellation
# 5. Verify status shows "Cancelled"
# 6. Check Stripe dashboard shows cancelled
```

## Test Database States

### SQLite Commands

```bash
# Open database
sqlite3 prisma/dev.db

# View all users
SELECT id, email, emailsSent, hasSubscribed, isCancelled FROM User;

# View email logs
SELECT * FROM EmailLog ORDER BY sentAt DESC;

# Manually update user for testing
UPDATE User SET emailsSent = 6, nextEmailAt = datetime('now') WHERE email = 'test@example.com';
```

### Reset Test Data

```bash
# Delete database
rm prisma/dev.db prisma/dev.db-journal

# Recreate
npm run prisma:migrate

# Or use Prisma Studio
npm run prisma:studio
# Delete records via UI
```

## Email Testing

### Without SendGrid

If `SENDGRID_API_KEY` is not set, emails will fail. Options:

**Option 1: Check console logs**
```bash
# Magic link will be logged to console
# Copy the URL and visit manually
```

**Option 2: Use SendGrid free tier**
```bash
# Sign up: https://sendgrid.com
# Free: 100 emails/day
# Verify sender email
# Create API key
# Add to .env
```

**Option 3: Use MailTrap for testing**
```bash
# Sign up: https://mailtrap.io
# Get SMTP credentials
# Update email.ts to use SMTP instead of SendGrid
```

## Automated Testing

### Test User Journey

```javascript
// tests/user-journey.test.ts
describe('Email Course Flow', () => {
  it('sends 6 free emails', async () => {
    // Create user
    // Run cron 6 times
    // Verify 6 emails sent
    // Verify no subscription required
  })

  it('sends email 7 with subscription link', async () => {
    // Create user with 6 emails sent
    // Run cron
    // Verify email 7 sent
    // Verify checkout URL present
  })

  it('stops after email 7 without subscription', async () => {
    // Create user with 7 emails sent, no subscription
    // Run cron
    // Verify no email 8 sent
  })

  it('resumes after subscription', async () => {
    // Create user with 7 emails sent
    // Activate subscription
    // Run cron
    // Verify email 8 sent
  })
})
```

## Manual Test Checklist

### Authentication
- [ ] Sign up with new email
- [ ] Receive magic link email
- [ ] Click magic link
- [ ] Redirect to dashboard
- [ ] Session persists on refresh
- [ ] Logout works

### Email Delivery
- [ ] Email 1 sent on signup
- [ ] Emails 2-6 sent daily
- [ ] No payment mention in emails 1-6
- [ ] Email 7 contains subscription link
- [ ] No email 8 without subscription
- [ ] Email 8+ sent after subscription

### Subscription
- [ ] Subscribe button appears after email 7
- [ ] Stripe checkout opens
- [ ] Payment processes
- [ ] Webhook updates database
- [ ] Dashboard shows "Active Subscriber"
- [ ] Emails resume

### Cancellation
- [ ] Cancel button appears for subscribers
- [ ] Confirmation dialog shows
- [ ] Stripe subscription cancels
- [ ] Database updates
- [ ] Dashboard shows "Cancelled"
- [ ] No more emails sent

### Edge Cases
- [ ] Multiple users with different states
- [ ] User tries to subscribe twice
- [ ] Invalid magic link
- [ ] Expired magic link
- [ ] Webhook signature mismatch
- [ ] SendGrid API failure

## Production Testing

### Pre-Deploy Checklist

- [ ] All environment variables set
- [ ] Stripe webhook endpoint configured
- [ ] SendGrid sender verified
- [ ] Cron job configured
- [ ] Database migrated
- [ ] HTTPS enabled
- [ ] CORS configured (if needed)

### Post-Deploy Verification

```bash
# Test health
curl https://yourdomain.com

# Test cron (with auth)
curl -H "Authorization: Bearer CRON_SECRET" https://yourdomain.com/api/cron/send-emails

# Monitor logs
# Check Vercel/Railway/etc dashboard
```

### Monitoring

**Daily checks:**
- [ ] Cron job executed
- [ ] Emails sent successfully
- [ ] No failed payments
- [ ] No webhook errors

**Weekly checks:**
- [ ] Review EmailLog for delivery issues
- [ ] Check Stripe for failed payments
- [ ] Review SendGrid bounces
- [ ] Monitor user churn

## Troubleshooting

### Emails not sending

```bash
# Check SendGrid API key
echo $SENDGRID_API_KEY

# Check sender verification
# Visit SendGrid dashboard

# Check cron execution
curl http://localhost:3000/api/cron/send-emails

# Check user nextEmailAt
# Should be in the past to trigger
```

### Webhook not working

```bash
# Verify webhook secret matches
echo $STRIPE_WEBHOOK_SECRET

# Test with Stripe CLI
stripe trigger checkout.session.completed

# Check webhook logs in Stripe dashboard
```

### Subscription not activating

```bash
# Check webhook received
# Check Stripe logs

# Manually check database
npm run prisma:studio
# Verify hasSubscribed = true
# Verify subscriptionId is set
```

## Performance Testing

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create test config
cat > load-test.yml <<EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
      - post:
          url: "/api/auth/send-link"
          json:
            email: "test{{ \$randomNumber() }}@example.com"
EOF

# Run test
artillery run load-test.yml
```

### Database Performance

```bash
# Check query performance
# Add logging to prisma.ts:
# log: ['query']

# Monitor slow queries
# Optimize with indexes if needed
```
