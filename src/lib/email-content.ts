export interface EmailContent {
  subject: string
  content: string
}

export function getEmailContent(emailNumber: number): EmailContent {
  const emails: Record<number, EmailContent> = {
    1: {
      subject: 'Welcome to Your Learning Journey',
      content: `Welcome to 1dayping!

This is your first email in a transformative learning journey.

Over the next few days, you'll receive daily lessons designed to help you grow and learn at your own pace.

Today's lesson: Getting Started

The key to successful learning is consistency. By committing to open these emails daily, you're already taking the first step toward your goals.

See you tomorrow!`,
    },
    2: {
      subject: 'Day 2: Building the Foundation',
      content: `Welcome back!

Great job opening yesterday's email. You're already building momentum.

Today's lesson: Foundation Principles

Every skill starts with fundamentals. Don't rush through the basics - they're the building blocks for everything that comes next.

Take a moment today to reflect on what you learned yesterday.

Tomorrow, we'll dive deeper.`,
    },
    3: {
      subject: 'Day 3: Developing Good Habits',
      content: `You're on day 3!

Consistency is becoming a habit. That's powerful.

Today's lesson: Habit Formation

Studies show it takes about 21 days to form a habit. You're already 14% of the way there just by opening this email.

Small daily actions compound into remarkable results.

Keep going - see you tomorrow!`,
    },
    4: {
      subject: 'Day 4: Overcoming Challenges',
      content: `Welcome to day 4!

You're halfway through your first week. Impressive.

Today's lesson: Working Through Obstacles

Learning isn't always easy. There will be moments of confusion or frustration. That's completely normal - it means you're growing.

The difference between those who succeed and those who don't isn't talent. It's persistence.

You're showing up. That matters.`,
    },
    5: {
      subject: 'Day 5: Making Progress',
      content: `Day 5 already!

You've been consistent for nearly a week. That's something to be proud of.

Today's lesson: Recognizing Progress

Progress isn't always obvious. Sometimes growth happens in small, incremental ways that are hard to see day-to-day.

But look back at where you started. You've already learned more than you realize.

Two more free lessons coming your way!`,
    },
    6: {
      subject: 'Day 6: The Power of Practice',
      content: `Welcome to day 6!

This is your last free lesson before tomorrow's special email.

Today's lesson: Practice Makes Progress

Mastery doesn't come from knowing - it comes from doing. The real learning happens when you apply what you've learned.

Take action on something you've learned this week.

Tomorrow's email will be different. Watch for it.`,
    },
    7: {
      subject: 'Continue Your Journey - Special Offer',
      content: `You've completed the free trial!

Over the past 6 days, you've shown up consistently. That dedication is rare and valuable.

Today's message is different:

Your free trial has ended. To continue receiving daily lessons, you'll need to subscribe.

Here's what you get with a subscription:
- Daily lessons delivered to your inbox
- Unlimited access to all content
- Cancel anytime from your dashboard

Ready to continue? Subscribe now to keep your momentum going.

[Your subscription link will appear here]

If you choose not to subscribe, no worries - you can always come back later. Your progress is saved.`,
    },
  }

  // For emails 8+, generate ongoing content
  if (emailNumber > 7) {
    return {
      subject: `Day ${emailNumber}: Advanced Lesson`,
      content: `Welcome to day ${emailNumber}!

Today's advanced lesson continues your learning journey.

As a subscriber, you have unlimited access to daily insights and lessons designed to help you grow.

Keep up the great work - your consistency is paying off.

Tomorrow, we'll explore new concepts together.`,
    }
  }

  return emails[emailNumber] || emails[1]
}
