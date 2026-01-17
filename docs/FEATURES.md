# Features Documentation

## Email Course Delivery

### Business Logic

**Free Trial (Emails 1-6)**
- First 6 emails are completely free
- No payment required
- No mention of subscription in emails 1-6
- One email delivered per day

**Subscription Email (Email 7)**
- ONLY email that mentions subscription
- Contains Stripe checkout link
- User must subscribe to continue
- No more emails sent without subscription

**Paid Subscription (Email 8+)**
- Daily emails resume after payment
- Unlimited emails while subscription is active
- User can cancel anytime from dashboard

### Email Content

Email templates located in: `src/lib/email-content.ts`

- Email 1: Welcome message
- Email 2-6: Progressive learning content
- Email 7: Special subscription offer with Stripe checkout link
- Email 8+: Advanced ongoing content

### Scheduling

Emails are sent via cron job that hits `/api/cron/send-emails`

**Scheduling Logic:**
- New users: First email scheduled for tomorrow upon signup
- Subsequent emails: Scheduled 24 hours after previous email
- Email 7 without subscription: Stops scheduling
- After subscription: Resumes scheduling

## Subscription Management

### Stripe Integration

**Checkout Flow:**
1. User reaches email 7 or visits dashboard after trial
2. Clicks "Subscribe" button
3. Redirected to Stripe checkout
4. Completes payment
5. Webhook activates subscription
6. User redirected to dashboard with success message

**Pricing:**
- Configure in Stripe Dashboard
- Can be daily, weekly, or monthly recurring
- Set `STRIPE_PRICE_ID` in environment variables

### Webhook Events

Handled in: `/api/webhooks/stripe`

**Events:**
- `checkout.session.completed`: Activates subscription, resumes emails
- `customer.subscription.updated`: Updates subscription status
- `customer.subscription.deleted`: Marks as cancelled, stops emails

### Cancellation

**Process:**
1. User clicks "Cancel Subscription" in dashboard
2. Confirmation dialog appears
3. Stripe subscription cancelled via API
4. Database updated (isCancelled = true, nextEmailAt = null)
5. No more emails sent

**Important:**
- Cancellation is immediate
- No refunds (handled by Stripe settings)
- User can re-subscribe by contacting support

## Dashboard

### Status Indicators

**Free Trial Active:**
- Shows remaining free emails (e.g., "5 emails remaining")
- Displays next email scheduled time
- No subscription CTA

**Trial Ended (Not Subscribed):**
- Shows "Trial Ended - Subscribe to Continue"
- Displays subscription CTA button
- No next email scheduled

**Active Subscriber:**
- Shows "Active Subscriber" status
- Displays next email scheduled time
- Shows cancellation button

**Cancelled:**
- Shows "Subscription Cancelled" message
- No next email scheduled
- No re-subscription option (contact support)

## API Endpoints

### Email Sending

**GET `/api/cron/send-emails`**

Processes all users who need their next email.

Headers:
- `Authorization: Bearer {CRON_SECRET}` (optional, for production)

Response:
```json
{
  "success": true,
  "emailsSent": 5,
  "emailsFailed": 0,
  "results": [...]
}
```

**Logic:**
- Finds users where `nextEmailAt <= now`
- Excludes cancelled users
- Only sends to free trial (< 7 emails) OR subscribed users
- Creates checkout URL for email 7
- Updates user record and logs email

### Subscription

**POST `/api/stripe/create-checkout`**

Creates Stripe checkout session for authenticated user.

Requirements:
- User must be logged in
- Email count must be >= 7
- Not already subscribed

Response:
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**POST `/api/stripe/cancel-subscription`**

Cancels active subscription for authenticated user.

Requirements:
- User must be logged in
- Must have active subscription

Response:
```json
{
  "success": true
}
```

**POST `/api/webhooks/stripe`**

Receives and processes Stripe webhook events.

Headers:
- `stripe-signature`: Webhook signature for verification

## Security

### Authentication
- Magic link (passwordless)
- 15-minute expiration
- One-time use tokens
- HTTP-only session cookies

### Stripe Webhooks
- Signature verification required
- Secret stored in `STRIPE_WEBHOOK_SECRET`
- Rejects unsigned requests

### Cron Jobs
- Optional `CRON_SECRET` for production
- Bearer token authentication
- Prevents unauthorized email sending

## Database

### User State Machine

```
NEW USER (emailsSent: 0)
    ↓
FREE TRIAL (emailsSent: 1-6)
    ↓
EMAIL 7 SENT (emailsSent: 7, hasSubscribed: false)
    ↓
    ├─→ SUBSCRIBED (hasSubscribed: true) → ACTIVE (emails continue)
    ├─→ NOT SUBSCRIBED (hasSubscribed: false) → PAUSED (no emails)
    └─→ CANCELLED (isCancelled: true) → STOPPED (no emails)
```

### Key Fields

**User Model:**
- `emailsSent`: Count of delivered emails (0-∞)
- `hasSubscribed`: Payment completed flag
- `subscriptionId`: Stripe subscription ID
- `stripeCustomerId`: Stripe customer ID
- `nextEmailAt`: Scheduled time for next email
- `isCancelled`: Cancellation flag
- `lastEmailSentAt`: Timestamp of last delivery

### Email Log

Tracks all sent emails for debugging and analytics.

Fields:
- `emailNumber`: Which email in sequence (1-∞)
- `subject`: Email subject line
- `status`: "sent" or "failed"
- `sentAt`: Delivery timestamp

## Cron Setup

### Development

Manual trigger:
```bash
curl http://localhost:3000/api/cron/send-emails
```

### Production

**Option 1: External Cron Service (Recommended)**

Use services like:
- Vercel Cron
- Cron-job.org
- EasyCron
- GitHub Actions

Example with cron-job.org:
1. Create account
2. Add job: `https://yourdomain.com/api/cron/send-emails`
3. Set schedule: Daily at 9:00 AM
4. Add header: `Authorization: Bearer {CRON_SECRET}`

**Option 2: Server Cron**

Add to crontab:
```bash
0 9 * * * curl -H "Authorization: Bearer SECRET" https://yourdomain.com/api/cron/send-emails
```

**Recommended Time:**
- 9:00 AM user local time
- Or 9:00 AM UTC for consistent global delivery

## Monitoring

### Email Logs

View in Prisma Studio:
```bash
npm run prisma:studio
```

Navigate to EmailLog table to see:
- All sent emails
- Delivery timestamps
- Status (sent/failed)

### User States

Check dashboard or Prisma Studio to monitor:
- Active trial users
- Users waiting for subscription
- Active subscribers
- Cancelled subscriptions

### SendGrid Dashboard

Monitor:
- Delivery rates
- Bounce rates
- Open rates
- Click rates (for email 7)

### Stripe Dashboard

Monitor:
- Active subscriptions
- Churn rate
- Revenue
- Failed payments
