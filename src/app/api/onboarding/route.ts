import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user-email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { category, goal, stage } = await request.json();

    if (!category || !goal || !stage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create goal
    const goalRecord = await prisma.goal.create({
      data: {
        userId: user.id,
        category,
        goalText: goal,
        stage,
      },
    });

    // Generate 14-day email plan using OpenAI
    console.log('Generating email plan with OpenAI...');

    const prompt = `You are a personal coach helping someone achieve their goal. Create a 14-day email course.

Goal: ${goal}
Category: ${category}
Level: ${stage}

Generate exactly 14 emails. For each email provide:
1. subject: Engaging subject line (max 60 chars)
2. preview: Short preview for paywall (2-3 sentences, ~100 chars)
3. content: Full email content (200-300 words, motivational and actionable)

Format as JSON array with 14 objects, each having: dayNumber, subject, preview, content

Focus on:
- Day 1-3: Foundation and mindset
- Day 4-7: Building habits and momentum
- Day 8-10: Overcoming obstacles
- Day 11-14: Mastery and next steps

Make it personal, actionable, and encouraging.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert personal development coach. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    let emails;
    try {
      const parsed = JSON.parse(responseText);
      emails = parsed.emails || parsed;

      if (!Array.isArray(emails) || emails.length !== 14) {
        throw new Error('Invalid email format');
      }
    } catch (e) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Failed to generate email plan');
    }

    // Create email plan
    const emailPlan = await prisma.emailPlan.create({
      data: {
        goalId: goalRecord.id,
        emails: {
          create: emails.map((email: any, index: number) => ({
            dayNumber: index + 1,
            subject: email.subject || `Day ${index + 1}: Your Journey`,
            content: email.content || '',
            preview: email.preview || email.content.substring(0, 100) + '...',
          })),
        },
      },
      include: {
        emails: true,
      },
    });

    // Mark user onboarding as complete
    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingComplete: true },
    });

    console.log(`✅ Created goal and ${emailPlan.emails.length} emails for ${userEmail}`);

    return NextResponse.json({
      success: true,
      goalId: goalRecord.id,
      emailsGenerated: emailPlan.emails.length,
    });
  } catch (error: any) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
