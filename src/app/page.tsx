'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon, CheckIcon, XIcon, TrendingUpIcon, MailIcon, ZapIcon, HeartIcon } from 'lucide-react'

export default function Home() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [goal, setGoal] = useState('')
  const [level, setLevel] = useState('')
  const [email, setEmail] = useState('')

  const handleCategorySelect = (cat: string) => {
    setCategory(cat)
    setTimeout(() => setStep(2), 300)
  }

  const handleLevelSelect = (lvl: string) => {
    setLevel(lvl)
    setTimeout(() => setStep(4), 300)
  }

  const handleGoalNext = () => {
    if (goal.trim()) {
      setStep(3)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to onboarding with data
    const params = new URLSearchParams({
      category,
      goal,
      level,
      email,
    })
    window.location.href = `/onboarding?${params.toString()}`
  }

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      {/* Navbar */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-container relative mx-auto">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              1dayping
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#how-it-works" className="text-sm hover:text-muted-foreground transition-colors">
                How it works
              </a>
              <a href="#who-its-for" className="text-sm hover:text-muted-foreground transition-colors">
                Who it's for
              </a>
              <a href="#faq" className="text-sm hover:text-muted-foreground transition-colors">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden text-sm md:block hover:text-muted-foreground transition-colors">
                Sign in
              </Link>
              <Button variant="default" asChild>
                <Link href="/onboarding">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <Section className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0">
        <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
            <Badge variant="outline" className="animate-appear">
              <span className="text-muted-foreground">
                Email-first goal reminders
              </span>
            </Badge>

            <h1 className="animate-appear text-4xl leading-tight font-semibold text-balance opacity-0 delay-100 sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight">
              Personalized Daily Goal Reminders — Delivered by Email
            </h1>

            <p className="text-md animate-appear text-muted-foreground max-w-[740px] font-medium text-balance opacity-0 delay-300 sm:text-xl">
              Set one goal. Get one email a day. A quiet partner that keeps you connected to what you care about — with soft reminders, helpful prompts, and small next steps.
            </p>

            <div className="animate-appear flex flex-col gap-4 opacity-0 delay-500 sm:flex-row">
              <Button variant="default" size="lg" asChild>
                <a href="#get-started">
                  Start Now
                  <ArrowRightIcon className="ml-2 size-4" />
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground animate-appear opacity-0 delay-700">
              No apps. No pressure. Just email. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section>
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">92%</div>
              <div className="text-sm text-muted-foreground">Stay consistent</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">~3min</div>
              <div className="text-sm text-muted-foreground">Daily reading time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">14 days</div>
              <div className="text-sm text-muted-foreground">Free course</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-sm text-muted-foreground">Apps required</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Problem Section with Cards */}
      <Section className="bg-muted/30">
        <div className="max-w-container mx-auto">
          <h2 className="text-center text-3xl leading-tight font-semibold mb-12 sm:text-5xl sm:leading-tight">
            Your goals don't fail. Your attention gets stolen.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-4 rounded-2xl p-6 border border-destructive/20">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <XIcon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">They just drift</h3>
              <p className="text-sm text-muted-foreground">Days get busy. Motivation disappears. The "I'll do it tomorrow" loop quietly wins.</p>
            </div>

            <div className="glass-4 rounded-2xl p-6 border border-destructive/20">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <XIcon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Complex systems fail</h3>
              <p className="text-sm text-muted-foreground">Another dashboard, another app, another habit tracker that you'll stop using in a week.</p>
            </div>

            <div className="glass-4 rounded-2xl p-6 border border-green-500/20">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Daily touchpoint works</h3>
              <p className="text-sm text-muted-foreground">A consistent signal that pulls you back to your intention — gently, daily, without drama.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Comparison Table */}
      <Section>
        <div className="max-w-container mx-auto">
          <h2 className="text-center text-3xl leading-tight font-semibold mb-12 sm:text-5xl sm:leading-tight">
            Email vs Everything Else
          </h2>

          <div className="glass-3 rounded-2xl overflow-hidden border border-border">
            <div className="grid grid-cols-3 border-b border-border">
              <div className="p-4 font-semibold"></div>
              <div className="p-4 font-semibold text-center bg-muted/50">Apps & Trackers</div>
              <div className="p-4 font-semibold text-center bg-primary/5">1dayping Email</div>
            </div>

            <div className="grid grid-cols-3 border-b border-border/50">
              <div className="p-4 text-sm">Daily notifications</div>
              <div className="p-4 text-center"><XIcon className="w-5 h-5 text-destructive mx-auto" /></div>
              <div className="p-4 text-center"><CheckIcon className="w-5 h-5 text-green-600 mx-auto" /></div>
            </div>

            <div className="grid grid-cols-3 border-b border-border/50 bg-muted/20">
              <div className="p-4 text-sm">Low pressure</div>
              <div className="p-4 text-center"><XIcon className="w-5 h-5 text-destructive mx-auto" /></div>
              <div className="p-4 text-center"><CheckIcon className="w-5 h-5 text-green-600 mx-auto" /></div>
            </div>

            <div className="grid grid-cols-3 border-b border-border/50">
              <div className="p-4 text-sm">No app to install</div>
              <div className="p-4 text-center"><XIcon className="w-5 h-5 text-destructive mx-auto" /></div>
              <div className="p-4 text-center"><CheckIcon className="w-5 h-5 text-green-600 mx-auto" /></div>
            </div>

            <div className="grid grid-cols-3 border-b border-border/50 bg-muted/20">
              <div className="p-4 text-sm">Personalized content</div>
              <div className="p-4 text-center text-sm text-muted-foreground">Generic</div>
              <div className="p-4 text-center"><CheckIcon className="w-5 h-5 text-green-600 mx-auto" /></div>
            </div>

            <div className="grid grid-cols-3">
              <div className="p-4 text-sm">Easy to return to</div>
              <div className="p-4 text-center"><XIcon className="w-5 h-5 text-destructive mx-auto" /></div>
              <div className="p-4 text-center"><CheckIcon className="w-5 h-5 text-green-600 mx-auto" /></div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features as Cards */}
      <Section className="bg-muted/30">
        <div className="max-w-container mx-auto">
          <h2 className="text-center text-3xl leading-tight font-semibold mb-4 sm:text-5xl sm:leading-tight">
            What makes it work
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Each email is built for you based on your goal, category, and level
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-4 rounded-2xl p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MailIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized for you</h3>
              <p className="text-muted-foreground mb-4">
                Not generic motivational quotes. Real guidance based on your specific goal, your life area, and where you are right now.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Category-specific insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Level-appropriate steps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your words, your goal</span>
                </li>
              </ul>
            </div>

            <div className="glass-4 rounded-2xl p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ZapIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Actionable, not overwhelming</h3>
              <p className="text-muted-foreground mb-4">
                Micro-actions you can do in 5–15 minutes. Plus a softer option for low-energy days.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Small, clear next steps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Low-energy alternatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No guilt, no pressure</span>
                </li>
              </ul>
            </div>

            <div className="glass-4 rounded-2xl p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUpIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Designed for consistency</h3>
              <p className="text-muted-foreground mb-4">
                Email doesn't interrupt. It waits for you. Easy to return to when you're ready.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Quiet & calm delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Hard to ignore forever</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>14-day structured path</span>
                </li>
              </ul>
            </div>

            <div className="glass-4 rounded-2xl p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HeartIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Like a calm partner</h3>
              <p className="text-muted-foreground mb-4">
                No loud motivation. No "hustle" energy. Just a daily reminder that your goal still matters.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Gentle accountability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Understanding tone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Encouragement, not pressure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* How It Works - Timeline */}
      <Section id="how-it-works">
        <div className="max-w-container mx-auto">
          <h2 className="text-center text-3xl leading-tight font-semibold mb-4 sm:text-5xl sm:leading-tight">
            Start in one minute
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            You don't need to create an account. You don't need to log into anything.
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

              <div className="space-y-8">
                {[
                  { step: '1', title: 'Choose a category', desc: 'Pick your life area' },
                  { step: '2', title: 'Write your goal', desc: 'In your own words' },
                  { step: '3', title: 'Select your level', desc: 'Beginner, intermediate, or advanced' },
                  { step: '4', title: 'Enter your email', desc: "That's it. No password needed" },
                  { step: '✓', title: 'Start receiving emails', desc: 'Your first message arrives tomorrow' },
                ].map((item, i) => (
                  <div key={i} className="relative flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xl z-10">
                      {item.step}
                    </div>
                    <div className="flex-1 glass-3 rounded-xl p-6 border border-border">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 glass-4 max-w-2xl mx-auto rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Why daily email reminders work</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-2xl mb-2">📧</div>
                <div className="font-medium mb-1">Quiet</div>
                <div className="text-muted-foreground">Waits for you</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-medium mb-1">Consistent</div>
                <div className="text-muted-foreground">Every day</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium mb-1">Persistent</div>
                <div className="text-muted-foreground">Hard to ignore</div>
              </div>
              <div>
                <div className="text-2xl mb-2">↩️</div>
                <div className="font-medium mb-1">Returnable</div>
                <div className="text-muted-foreground">Always there</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Who It's For */}
      <Section className="bg-muted/30" id="who-its-for">
        <div className="max-w-container mx-auto">
          <h2 className="text-center text-3xl leading-tight font-semibold mb-12 sm:text-5xl sm:leading-tight">
            Who this is for
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🚀', title: 'Founders & builders', desc: 'Who keep pausing and restarting their side projects' },
              { emoji: '📚', title: 'Skill learners', desc: 'Who want daily momentum without burning out' },
              { emoji: '🎯', title: 'Long-term goals', desc: 'Anyone working on something that needs consistency' },
              { emoji: '🧘', title: 'Anti-trackers', desc: 'People who dislike rigid habit tracking systems' },
              { emoji: '💬', title: 'Need accountability', desc: 'Want a gentle partner, not a drill sergeant' },
              { emoji: '💭', title: 'Chronic starters', desc: 'Care deeply but struggle to stay consistent' },
            ].map((item, i) => (
              <div key={i} className="glass-4 rounded-xl p-6 border border-border text-center">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-4 max-w-2xl mx-auto rounded-2xl p-8 text-center border-2 border-primary/20">
            <p className="text-lg font-medium">
              If you've ever thought "I care about this… I just don't stay consistent," this was built for that exact situation.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <div className="max-w-container mx-auto">
          <h2 className="text-center text-3xl leading-tight font-semibold mb-12 sm:text-5xl sm:leading-tight">
            Questions
          </h2>
          <div className="mx-auto w-full max-w-2xl space-y-4">
            {[
              { q: 'Do I need an account?', a: 'No. You start with only your email.' },
              { q: 'Can I change my goal later?', a: "Yes. You'll be able to adjust your goal from links in the emails or from the site." },
              { q: 'How often will you email me?', a: 'Once a day.' },
              { q: 'Is this a coaching program?', a: "No. It's a daily email companion with reminders, prompts, and small next steps." },
              { q: 'Can I stop anytime?', a: 'Yes. One-click unsubscribe.' },
            ].map((faq, i) => (
              <details key={i} className="group glass-3 rounded-xl border border-border p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {faq.q}
                  <svg className="h-5 w-5 text-muted-foreground transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Get Started Form */}
      <Section id="get-started" className="group relative overflow-hidden bg-muted/30">
        <div className="max-w-container relative z-10 mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl leading-tight font-semibold mb-4 sm:text-5xl sm:leading-tight">
                Start your journey
              </h2>
              <p className="text-lg text-muted-foreground">
                Answer a few quick questions to personalize your daily emails
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              {/* Progress indicator */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= num
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {num}
                    </div>
                    {num < 4 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step > num ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="min-h-[300px]">
                {/* Step 1: Category */}
                {step === 1 && (
                  <div className="space-y-6 animate-appear">
                    <div>
                      <label className="block text-xl font-semibold mb-2 text-foreground">
                        Choose your goal category
                      </label>
                      <p className="text-muted-foreground mb-6">Pick the area you want to focus on</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Health & Fitness', 'Career', 'Learning', 'Creativity', 'Relationships', 'Personal Growth'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 rounded-lg p-4 text-sm font-medium transition-all text-foreground"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Goal */}
                {step === 2 && (
                  <div className="space-y-6 animate-appear">
                    <div>
                      <label className="block text-xl font-semibold mb-2 text-foreground">
                        What is your goal?
                      </label>
                      <p className="text-muted-foreground mb-6">
                        Write it in your own words
                      </p>
                    </div>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g., Exercise 3 times per week"
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
                      autoFocus
                    />
                    <Button
                      type="button"
                      onClick={handleGoalNext}
                      size="lg"
                      className="w-full"
                      disabled={!goal.trim()}
                    >
                      Continue
                      <ArrowRightIcon className="ml-2 size-4" />
                    </Button>
                  </div>
                )}

                {/* Step 3: Level */}
                {step === 3 && (
                  <div className="space-y-6 animate-appear">
                    <div>
                      <label className="block text-xl font-semibold mb-2 text-foreground">
                        Select your experience level
                      </label>
                      <p className="text-muted-foreground mb-6">This helps us personalize your emails</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleLevelSelect(lvl)}
                          className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 rounded-lg p-4 text-sm font-medium transition-all text-foreground"
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Email */}
                {step === 4 && (
                  <div className="space-y-6 animate-appear">
                    <div>
                      <label className="block text-xl font-semibold mb-2 text-foreground">
                        Enter your email
                      </label>
                      <p className="text-muted-foreground mb-6">
                        No password needed. Unsubscribe anytime.
                      </p>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground mb-4"
                      required
                      autoFocus
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={!email.trim()}
                    >
                      Start receiving daily emails
                      <ArrowRightIcon className="ml-2 size-4" />
                    </Button>
                  </div>
                )}
              </form>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Your first email arrives tomorrow morning
            </p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-background w-full px-4 py-12 border-t border-border">
        <div className="max-w-container mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
            </div>
            <p className="text-sm text-muted-foreground">Your email stays yours</p>
            <p className="text-xs text-muted-foreground">We send one email per day. You can unsubscribe anytime.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
